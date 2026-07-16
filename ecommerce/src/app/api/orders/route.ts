import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req: NextRequest) {
  const user = getUserFromRequest(req)

  if (!user) {
    return NextResponse.json({message: 'Acesso negado'}, {status: 401})
  }

  const orders = await prisma.order.findMany({
    where: {userId: user.userId},
  })
  if (!orders) {
    return NextResponse.json({message: 'Pedidos não encontrados'}, {status: 404})
  }

  return NextResponse.json(orders, {status: 200})
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ message: "Acesso negado" }, { status: 401 });
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      // 1. Busca os itens do carrinho, já com dados do Canvas
      const cartItems = await tx.cartItem.findMany({
        where: { userId: user.userId },
        include: { canvas: true },
      });

      // 2. Carrinho vazio
      if (cartItems.length === 0) {
        throw new Error("Carrinho vazio");
      }

      // 3. Valida estoque de cada item
      for (const item of cartItems) {
        if (item.canvas.stock < item.quantity) {
          throw new Error(
            `Estoque insuficiente para "${item.canvas.paintingName}". Disponível: ${item.canvas.stock}`
          );
        }
      }

      // 4. Calcula o total no backend (nunca confia no front)
      const total = cartItems.reduce(
        (sum, item) => sum + item.canvas.price * item.quantity,
        0
      );

      // 5. Cria a Order com os OrderItems aninhados, preço congelado
      const newOrder = await tx.order.create({
        data: {
          userId: user.userId,
          status: "PAID", // checkout simulado, direto pago
          total,
          items: {
            create: cartItems.map((item) => ({
              canvasId: item.canvasId,
              quantity: item.quantity,
              price: item.canvas.price,
            })),
          },
        },
        include: { items: true },
      });

      // 6. Decrementa o estoque de cada Canvas
      for (const item of cartItems) {
        await tx.canvas.update({
          where: { id: item.canvasId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // 7. Limpa o carrinho
      await tx.cartItem.deleteMany({
        where: { userId: user.userId },
      });

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar pedido";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}