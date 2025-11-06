"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DashboardResponse } from "../../dashboard/schemas";

interface MyProductsProps {
  dashboard: DashboardResponse;
}

interface Product {
  id: string;
  productName: string;
  routineStep: string;
  productUrl: string;
  purchaseInstructions: string | null;
}

export function MyProducts({ dashboard }: MyProductsProps) {
  // Extract unique products from both morning and evening routines
  const extractProducts = (): Product[] => {
    const productMap = new Map<string, Product>();
    const { routine } = dashboard;

    if (!routine) return [];

    // Combine morning and evening products
    const allProducts = [
      ...(routine.morning || []),
      ...(routine.evening || []),
    ];

    // Use productName as key to avoid duplicates
    allProducts.forEach((item) => {
      if (!productMap.has(item.productName)) {
        productMap.set(item.productName, {
          id: item.id,
          productName: item.productName,
          routineStep: item.routineStep,
          productUrl: item.productUrl,
          purchaseInstructions: routine.productPurchaseInstructions || null,
        });
      }
    });

    return Array.from(productMap.values());
  };

  const products = extractProducts();

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">My Products</h2>

      <Table className="table-fixed">
        <TableHeader className="bg-skinbestie-primary-light [&_tr]:border-0">
          <TableRow>
            <TableHead className="w-[200px] whitespace-normal">
              Product
            </TableHead>
            <TableHead className="w-[120px]">Category</TableHead>
            <TableHead className="w-[130px]">Store Link</TableHead>
            <TableHead className="w-[250px] whitespace-normal">
              Purchase Instructions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="border-0">
              <TableCell className="font-semibold whitespace-normal break-words">
                {product.productName}
              </TableCell>
              <TableCell>{product.routineStep}</TableCell>
              <TableCell>
                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-skinbestie-primary hover:underline"
                >
                  View Product
                </a>
              </TableCell>
              <TableCell className="text-gray-600 whitespace-normal break-words">
                {product.purchaseInstructions || "No special instructions"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
