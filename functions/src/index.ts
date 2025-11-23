import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Interface para o pedido de checkout
interface CheckoutRequest {
  productId: string;
}

/**
 * API Segura de Checkout
 * Valida stock, previne auto-compra e executa transação financeira atómica.
 * Substitui a necessidade de API Route do Next.js em arquiteturas Firebase/Vite.
 */
export const secureCheckout = functions.https.onRequest(async (req, res) => {
  // 1. CORS e Método
  res.set("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  // 2. Autenticação (Bearer Token)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send("Unauthorized");
    return;
  }
  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const buyerId = decodedToken.uid;
    const { productId } = req.body as CheckoutRequest;

    if (!productId) {
      res.status(400).send("Product ID required");
      return;
    }

    // 3. Transação Atómica
    await db.runTransaction(async (transaction) => {
      // a) Leitura Confiável (Server-Side)
      const productRef = db.collection("products").doc(productId);
      const productDoc = await transaction.get(productRef);

      if (!productDoc.exists) {
        throw new Error("Product not found");
      }

      const productData = productDoc.data()!;

      // b) Validações de Negócio
      if (productData.status !== "available") {
        throw new Error("Product is no longer available");
      }

      if (productData.sellerId === buyerId) {
        throw new Error("You cannot buy your own product");
      }

      // c) Cálculos Financeiros
      const price = productData.price;
      const fee = price * 0.05; // 5% fee
      const total = price + fee;

      // d) Execução das Escritas (Batch)
      
      // 1. Criar registo de Venda
      const saleRef = db.collection("sales").doc();
      transaction.set(saleRef, {
        productId,
        sellerId: productData.sellerId,
        buyerId,
        price,
        fee,
        total,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 2. Criar registo de Compra
      const purchaseRef = db.collection("purchases").doc();
      transaction.set(purchaseRef, {
        productId,
        sellerId: productData.sellerId,
        buyerId,
        price,
        total,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 3. Atualizar Produto
      transaction.update(productRef, {
        status: "sold",
        buyerId: buyerId,
        soldAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 4. Registar Transação na Wallet (Vendedor recebe saldo pendente)
      const walletRef = db.collection("wallet_transactions").doc();
      transaction.set(walletRef, {
        userId: productData.sellerId,
        type: "sale",
        amount: price,
        status: "pending", // Saldo fica pendente até entrega
        referenceId: saleRef.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    res.status(200).json({ success: true, message: "Purchase successful" });

  } catch (error: any) {
    console.error("Transaction failure:", error);
    if (error.message === "Product is no longer available") {
      res.status(409).send(error.message);
    } else if (error.code === 'auth/argument-error') {
       res.status(401).send("Invalid Token");
    } else {
      res.status(500).send("Internal Server Error: " + error.message);
    }
  }
});