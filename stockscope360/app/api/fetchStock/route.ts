import { NextRequest, NextResponse } from "next/server";
import pool from "@/libs/mysql";
import { StockMetaInfo } from "@/types";
import { RowDataPacket } from "mysql2";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stockId = searchParams.get("stockId");

  try {
    const db = await pool.getConnection();

    const query = `SELECT Name, Company, Industry FROM StockMetadata WHERE StockId = ${stockId}`;
    const [rows] = await db.execute<RowDataPacket[]>(query, [stockId]);
    db.release();

    if (rows.length === 0) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }

    const stockInfo = rows[0] as StockMetaInfo;

    return NextResponse.json(stockInfo);
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}