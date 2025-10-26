import { OCRItem } from '../types';

interface MockReceiptResponse {
  receipts: {
    shop: string;
    items: OCRItem[];
    currency: string;
  }[];
}

export const dummyReceiptResponse: MockReceiptResponse = {
  "receipts": [
    {
      "shop": "LIDL",
      "items": [
        { "item": "Paprika grün", "quantity": 1, "price": 1.29 },
        { "item": "Romatomaten", "quantity": 1, "price": 1.49 },
        { "item": "Backofen Feine Pommes", "quantity": 2, "price": 3.38 },
        { "item": "Weidemilch 3.8%", "quantity": 1, "price": 1.35 },
        { "item": "Chio Dip Mild Salsa", "quantity": 1, "price": 2.49 },
        { "item": "Bull's Eye Feinkost Smoke", "quantity": 1, "price": 3.99 },
        { "item": "Bioland Haferflocken", "quantity": 2, "price": 1.7 },
        { "item": "Eier Bodenhaltung (18 Stück)", "quantity": 1, "price": 3.39 },
        { "item": "Ananas Scheiben", "quantity": 1, "price": 2.55 },
        { "item": "Orangen Direktsaft", "quantity": 1, "price": 2.09 },
        { "item": "Maracuja Nektar", "quantity": 1, "price": 2.49 },
        { "item": "Multivitaminsaft", "quantity": 1, "price": 2.15 },
        { "item": "Waffelröllchen Schoko", "quantity": 1, "price": 2.99 },
        { "item": "Milka Alpenmilch", "quantity": 1, "price": 1.99 },
        { "item": "Milka Kuhflecken", "quantity": 1, "price": 1.99 },
        { "item": "Tortilla Chips Nacho Käse", "quantity": 1, "price": 1.59 },
        { "item": "Chocolate Cookies Vegan", "quantity": 1, "price": 1.49 },
        { "item": "Kleinkuchen mit Milchfüllung", "quantity": 1, "price": 2.59 },
        { "item": "Backpapier braun", "quantity": 1, "price": 0.95 }
      ],
      "currency": "Euro"
    }
  ]
};
