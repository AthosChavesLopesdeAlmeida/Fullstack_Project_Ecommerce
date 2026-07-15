import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {  
  const user = getUserFromRequest(req)

  if (!user) {
    return NextResponse.json({message: 'Acesso negado'}, {status: 403})
  }

  const products = await prisma.canvas.findMany({where: {stock: {gt: 0}}})
  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({message: 'Acesso negado'}, {status: 403})
  }

  const { artistName, paintingName, size, frameMaterial, price, stock, imageUrl } = await req.json()

  const canvas = await prisma.canvas.create({
    data: { artistName, paintingName, size, frameMaterial, price, stock, imageUrl }
  })

  return NextResponse.json(canvas, {status: 200})
}