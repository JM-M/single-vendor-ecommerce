export const getPaystackAccessCode = async ({
  customerEmail,
  koboAmount,
}: {
  customerEmail: string;
  koboAmount: number;
}) => {
  const response = await fetch(
    "https://api.paystack.co/transaction/initialize",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY!}`,
      },
      body: JSON.stringify({ email: customerEmail, amount: koboAmount }),
    },
  );

  return await response.json();
};
