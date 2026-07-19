import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(req)
  const { id } = await params

  if (!user) {
    return NextResponse.json({message: 'Acesso negado'}, {status: 401})
  }

  const order = await prisma.order.findUnique({
    where: {id, userId: user.userId},
    include: {
      items: {
        include: {
          canvas: true
        }
      }
    }
  })

  if (!order) {
    return NextResponse.json({message: 'Pedidos não encontrados'}, {status: 404})
  }

  return NextResponse.json(order, {status: 200})
}