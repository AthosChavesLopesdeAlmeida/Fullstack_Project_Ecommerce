import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req:NextRequest) {
  const user = getUserFromRequest(req)

  if (!user) {
    return NextResponse.json({message: 'Acesso negado'}, {status: 401})
  }

  const cartItems = await prisma.cartItem.findMany({
    where: {userId: user.userId},
    include: {canvas: true}
  })

  if (!cartItems) {
    return NextResponse.json({message: 'Itens não encontrados no carrinho'}, {status: 404})
  }

  return NextResponse.json(cartItems, {status: 200})
}

export async function POST (req: NextRequest) {
  const user = getUserFromRequest(req)

  if (!user) {
    return NextResponse.json({message: 'Acesso negado'}, {status: 401})
  }

  const body = await req.json();
  const { canvasId, quantity } = body;

  if (!canvasId || !quantity || quantity < 1) {
    return NextResponse.json(
      { error: "canvasId e quantity (>=1) são obrigatórios" },
      { status: 400 }
    );
  }

  const canvas = await prisma.canvas.findUnique({ where: { id: canvasId } });

  if (!canvas) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }

  if (canvas.stock < quantity) {
    return NextResponse.json({ error: "Estoque insuficiente" }, { status: 400 });
  }

  const cartItem = await prisma.cartItem.upsert({
    where: {
      userId_canvasId: {
        userId: user.userId,
        canvasId,
      },
    },
    update: {
      quantity: { increment: quantity },
    },
    create: {
      userId: user.userId,
      canvasId,
      quantity,
    },
  });

  return NextResponse.json(cartItem, { status: 201 });
}