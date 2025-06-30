import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useItemView } from "rjs-admin";
import { APIManager } from "rjs-frame";
import "../Status.css";
import { formatMoney } from "../Helper";

export const TransactionView = () => {
  const { item } = useItemView();
  const [transaction, setTransaction] = useState<any>(null);
  const [moneyTransaction, setMoneyTransaction] = useState<any>(null);

  useEffect(() => {
    if (item?.id) {
      APIManager.queryItem(`trade-executor:transaction`, item.id, {
        cache: true,
      }).then((response) => {
        setTransaction(response.data);
      });
    } else if (item) {
      setTransaction(item); // fallback for direct data
    }
  }, [item]);

  useEffect(() => {
    if (item?.id) {
      APIManager.query(`trade-executor:monetary-transaction`, {
        cache: true,
        search: {
            broker_order_id: item.id,
            query: `{"cr_account.in": ["INTRANSIT", "AVAILABLE", "INVESTMENT", "FEE", "TAX"], "broker_order_id": "${item.id}"}`,
            sort: "created.asc"
        }
      }).then((response) => {
        setMoneyTransaction(response.data);
      });
    } else if (item) {
      setMoneyTransaction(item); // fallback for direct data
    }
  }, [item]);

  if (!transaction) {
    return <div>No transaction found</div>;
  }

  // Helper for formatting ISO date
  const formatDate = (date: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };


  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b pb-2 mb-2">
        <span className="font-semibold text-lg">{transaction.order_id}: {transaction.type} {transaction.symbol} </span>
        <span className={`status-${transaction.status.toLowerCase()} ml-2 px-2 py-0.5 rounded text-xs font-medium`}>
          {transaction.status}
        </span>
      </div>

      {/* General Info */}
      <div>
        <h3 className="font-semibold text-base mb-2">General</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Symbol</div>
            <div>{transaction.symbol}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Broker</div>
            <div>{transaction.broker}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Type</div>
            <div>
              <span className={`status-${transaction.type.toLowerCase()} px-2 py-0.5 rounded text-xs`}>
                {transaction.type}
              </span>
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Quantity</div>
            <div>{transaction.quantity}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Price</div>
            <div>{formatMoney(transaction.price, transaction.currency)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Match</div>
            <div>{transaction.match}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Funding</div>
            <div>{transaction.funding}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Status</div>
            <div>
              <span className={`status-${transaction.status.toLowerCase()} px-2 py-0.5 rounded text-xs`}>
                {transaction.status}
              </span>
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Currency</div>
            <div>{transaction.currency}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Order ID</div>
            <div>{transaction.order_id}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Created</div>
            <div>{formatDate(transaction.created)}</div>
          </div>
        </div>
      </div>

      {/* Money Transaction */}
      <div className="">
      <h3 className="font-semibold text-base mb-2">Money Transaction</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border rounded">
            <thead>
              <tr className="bg-muted">
                <th className="px-2 py-1 text-left">Credit Account</th>
                <th className="text-left py-2 px-4 font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-2 px-4 font-medium text-muted-foreground">Currency</th>
                <th className="text-left py-2 px-4 font-medium text-muted-foreground">Note</th>
                <th className="text-left py-2 px-4 font-medium text-muted-foreground">Created</th>
              </tr>
            </thead>
            <tbody>
              {moneyTransaction?.map((mt: any, index: number) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="py-2 px-4">{mt.cr_account}</td>
                  <td className="py-2 px-4">{formatMoney(mt.amount, mt.currency)}</td>
                  <td className="py-2 px-4">{mt.currency}</td>
                  <td className="py-2 px-4">{mt.note}</td>
                  <td className="py-2 px-4">{formatDate(mt.created)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
