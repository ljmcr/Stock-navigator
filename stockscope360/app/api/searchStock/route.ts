import { NextRequest, NextResponse } from "next/server";
import pool from "@/libs/mysql";
import { StockTableInfo } from "@/types";
import { RowDataPacket } from "mysql2";

export interface StockId {
  StockId: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stockQuery = searchParams.get("stockQuery");
  const industry = searchParams.get("industry");
  const marketName = searchParams.get("marketName");
  const currency = searchParams.get("currency");
  const email = searchParams.get("email");

  try {
    const db = await pool.getConnection();
    let query1 = ``;
    if (stockQuery && !industry) {
      query1 = `CALL SearchStockPreferredCurrency ("${stockQuery}", "${marketName}", "${currency}")`;
    }
    if (!stockQuery && industry) {
      query1 = `CALL SearchIndustryPreferredCurrency ("${industry}", "${marketName}", "${currency}")`;
    }
    const [rows] = await db.execute<RowDataPacket[]>(query1, [
      stockQuery,
      marketName,
      currency,
    ]);

    const stockTableInfo = rows[0] as StockTableInfo[];

    const query2 = `SELECT StockId 
      FROM Favorites 
      WHERE UserId = (
          SELECT UserId 
          FROM UserInfo 
          WHERE Email = '${email}'
      );`;
    const [stockIdRows] = await db.execute<RowDataPacket[]>(query2, [email]);

    const stockIds = stockIdRows as StockId[];
    db.release();

    const stockTableInfoWithFavorites = stockTableInfo.map((stockInfo) => {
      const isFavorite = stockIds.some(
        (stock) => stock.StockId === stockInfo.StockId
      );

      return { ...stockInfo, IsFavorite: isFavorite };
    });

    return NextResponse.json(stockTableInfoWithFavorites);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
