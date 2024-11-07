import { NextRequest, NextResponse } from "next/server";
import pool from "@/libs/mysql";
import { StockDisplayInfo } from "@/types";
import { RowDataPacket } from "mysql2";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const start_date = searchParams.get("start_date");
  const end_date = searchParams.get("end_date");
  const email = searchParams.get("email");
  const stockIdsString = searchParams.get("stockIds");
  const stockIds = stockIdsString ? stockIdsString.split(",") : [];
  const currency = searchParams.get("currency");
  const frequency = searchParams.get("frequency");

  if (stockIds.length == 0 && !email) {
    return NextResponse.json({ error: "No Stock Ids" }, { status: 400 });
  }

  try {
    const db = await pool.getConnection();

    let query;
    let params;
    let joinClause = "";
    let selectClause = `
      AVG(sp.ClosingPrice) AS AvgClosingPrice,
      AVG(sp.OpeningPrice) AS AvgOpeningPrice,
      MAX(sp.High) AS High,
      MIN(sp.Low) AS Low,
      SUM(sp.Volume) AS TotalVolume
    `

    if (frequency === "daily") {
      selectClause = `
        sp.ClosingPrice AS AvgClosingPrice,
        sp.OpeningPrice AS AvgOpeningPrice,
        sp.High AS High,
        sp.Low AS Low,
        sp.Volume AS TotalVolume
      `
    }

    if (currency !== 'USD') {
      joinClause = `LEFT JOIN ConversionRate cr ON cr.Date = sp.Date AND cr.CurrencyName = ?`;
      if (frequency !== "daily") {
        selectClause = `
          AVG(sp.ClosingPrice * cr.AmountPerUSD) AS AvgClosingPrice,
          AVG(sp.OpeningPrice * cr.AmountPerUSD) AS AvgOpeningPrice,
          MAX(sp.High * cr.AmountPerUSD) AS High,
          MIN(sp.Low * cr.AmountPerUSD) AS Low,
          SUM(sp.Volume) AS TotalVolume
        `
      } else {
        selectClause = `
          sp.ClosingPrice * cr.AmountPerUSD AS AvgClosingPrice,
          sp.OpeningPrice * cr.AmountPerUSD AS AvgOpeningPrice,
          sp.High * cr.AmountPerUSD AS High,
          sp.Low * cr.AmountPerUSD AS Low,
          sp.Volume AS TotalVolume
        `
      }
    }

    if (email !== null) {
      if (frequency === "daily") {
        query = `
          SELECT 
              f.StockId,
              sm.Name AS StockName,
              sp.Date AS IntervalStart,
              ${selectClause}
          FROM 
              UserInfo ui
          JOIN 
              Favorites f ON ui.UserId = f.UserId
          JOIN 
              StockMetadata sm ON f.StockId = sm.StockId
          JOIN 
              StockPrice sp ON f.StockId = sp.StockId
          ${joinClause}
          WHERE 
              ui.Email = ? AND
              sp.Date BETWEEN ? AND ?
          ORDER BY 
              f.StockId, sp.Date;
        `;
        params = currency !== "USD" ? [currency, email, start_date, end_date] : [email, start_date, end_date];
      }
      else if (frequency === "yearly") {
        query = `
          SELECT 
              f.StockId,
              sm.Name AS StockName,
              DATE_FORMAT(sp.Date, '%Y-01-01') AS IntervalStart,
              ${selectClause}
          FROM 
              UserInfo ui
          JOIN 
              Favorites f ON ui.UserId = f.UserId
          JOIN 
              StockMetadata sm ON f.StockId = sm.StockId
          JOIN 
              StockPrice sp ON f.StockId = sp.StockId
          ${joinClause}
          WHERE 
              ui.Email = ? AND
              sp.Date BETWEEN ? AND DATE_FORMAT(DATE_SUB(DATE_ADD(?, INTERVAL 1 YEAR), INTERVAL 1 DAY), '%Y-%m-%d')
          GROUP BY 
              f.StockId,
              DATE_FORMAT(sp.Date, '%Y-01-01')
          ORDER BY 
              f.StockId,
              DATE_FORMAT(sp.Date, '%Y-01-01');
        `;
        params = currency !== "USD" ? [currency, email, start_date, end_date] : [email, start_date, end_date];
      }
      else {
        query = `
          SELECT 
              f.StockId,
              sm.Name AS StockName,
              DATE_FORMAT(sp.Date, '%Y-%m-01') AS IntervalStart,
              ${selectClause}
          FROM 
              UserInfo ui
          JOIN 
              Favorites f ON ui.UserId = f.UserId
          JOIN 
              StockMetadata sm ON f.StockId = sm.StockId
          JOIN 
              StockPrice sp ON f.StockId = sp.StockId
          ${joinClause}
          WHERE 
              ui.Email = ? AND
              sp.Date BETWEEN ? AND LAST_DAY(? + INTERVAL 1 MONTH)
          GROUP BY 
              f.StockId,
              DATE_FORMAT(sp.Date, '%Y-%m-01')
          ORDER BY 
              f.StockId,
              DATE_FORMAT(sp.Date, '%Y-%m-01');
        `;
        params = currency !== "USD" ? [currency, email, start_date, end_date] : [email, start_date, end_date];
      }
    } else {  // default view, use StockIds from params
      const placeholders = stockIds.map(() => "?").join(",");
      if (frequency === "daily") {
        query = `
          SELECT
              sp.stockId,
              sm.Name AS StockName,
              sp.Date AS IntervalStart,
              ${selectClause}
          FROM
              (SELECT *
              FROM StockPrice
              WHERE StockId IN (${placeholders})) as sp
          JOIN
              (SELECT *
              FROM StockMetadata
              WHERE StockId IN (${placeholders})) as sm
          ON
              sp.StockId = sm.StockId
          ${joinClause}
          WHERE
              sp.Date BETWEEN ? AND ?
          ORDER BY
              sp.StockId, sp.Date;
        `;
        params = currency !== "USD" ? [...stockIds, ...stockIds, currency, start_date, end_date] : [...stockIds, ...stockIds, start_date, end_date];
      } else if (frequency === "yearly") {
        query = `
          SELECT
              sp.StockId,
              sm.Name AS StockName,
              DATE_FORMAT(sp.Date, '%Y-01-01') AS IntervalStart,
              ${selectClause}
          FROM
              (SELECT *
              FROM StockPrice
              WHERE StockId IN (${placeholders})) as sp
          JOIN
              (SELECT *
              FROM StockMetadata
              WHERE StockId IN (${placeholders})) as sm
          ON
              sp.StockId = sm.StockId
          ${joinClause}
          WHERE
              sp.Date BETWEEN ? AND DATE_FORMAT(DATE_SUB(DATE_ADD(?, INTERVAL 1 YEAR), INTERVAL 1 DAY), '%Y-%m-%d')
          GROUP BY
              sp.StockId,
              DATE_FORMAT(sp.Date, '%Y-01-01')
          ORDER BY
              sp.StockId,
              DATE_FORMAT(sp.Date, '%Y-01-01');
        `;
        params = currency !== "USD" ? [...stockIds, ...stockIds, currency, start_date, end_date] : [...stockIds, ...stockIds, start_date, end_date];
      }
      else {
        query = `
          SELECT
              sp.StockId,
              sm.Name AS StockName,
              DATE_FORMAT(sp.Date, '%Y-%m-01') AS IntervalStart,
              ${selectClause}
          FROM
              (SELECT *
              FROM StockPrice
              WHERE StockId IN (${placeholders})) as sp
          JOIN
              (SELECT *
              FROM StockMetadata
              WHERE StockId IN (${placeholders})) as sm
          ON
              sp.StockId = sm.StockId
          ${joinClause}
          WHERE
              sp.Date BETWEEN ? AND LAST_DAY(? + INTERVAL 1 MONTH)
          GROUP BY
              sp.StockId,
              DATE_FORMAT(sp.Date, '%Y-%m-01')
          ORDER BY
              sp.StockId,
              DATE_FORMAT(sp.Date, '%Y-%m-01');
        `;
        params = currency !== "USD" ? [...stockIds, ...stockIds, currency, start_date, end_date] : [...stockIds, ...stockIds, start_date, end_date];
      }
    }

    const [rows] = await db.execute<RowDataPacket[]>(query, params);
    db.release();

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Stock info not found" },
        { status: 404 }
      );
    }

    const displayInfo = rows as StockDisplayInfo[];

    return NextResponse.json(displayInfo);
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}
