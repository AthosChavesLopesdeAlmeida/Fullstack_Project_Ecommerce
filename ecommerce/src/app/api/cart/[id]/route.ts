import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE (req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(req)
  const {id} = await params

  if (!user) {
    return NextResponse.json({message: 'Acesso negado'}, {status: 401})
  }

  const existingCartItem = await prisma.cartItem.findUnique({
    where: {id, userId: user.userId}
  })
  if (!existingCartItem) {
    return NextResponse.json({message: 'Item não encontrado'}, {status: 404})
  }

  await prisma.cartItem.delete({
    where: {id, userId: user.userId}
  })

  return NextResponse.json({message: 'Item retirado do carrinho com sucesso'}, {status: 200})
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(req);
  const {id} = await params

  if (!user) {
    return NextResponse.json({ message: "Acesso negado" }, { status: 401 });
  }

  const body = await req.json();
  const { quantity } = body;

  if (quantity === undefined || quantity < 0) {
    return NextResponse.json(
      { error: "quantity é obrigatório e deve ser >= 0" },
      { status: 400 }
    );
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { id },
    include: { canvas: true },
  });

  if (!cartItem) {
    return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
  }

  // Garante que o carrinho é do próprio usuário
  if (cartItem.userId !== user.userId) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  // Se quantity for 0, remove o item
  if (quantity === 0) {
    await prisma.cartItem.delete({ where: { id } });
    return NextResponse.json({ message: "Item removido do carrinho" }, { status: 200 });
  }

  if (cartItem.canvas.stock < quantity) {
    return NextResponse.json({ error: "Estoque insuficiente" }, { status: 400 });
  }

  const updated = await prisma.cartItem.update({
    where: { id },
    data: { quantity },
  });

  return NextResponse.json(updated, { status: 200 });
}