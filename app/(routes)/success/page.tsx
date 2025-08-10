"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Receipt, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';

interface ReceiptData {
  reference_id: string;
  user_id: string;
  email: string;
  amount_paid: number;
  created_at: string;
  stripe_session_id: string;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      const fetchReceipt = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('receipts')
          .select('*')
          .eq('stripe_session_id', sessionId)
          .single();

        if (data) {
          setReceipt(data);
        } else {
          console.error('Error fetching receipt:', error);
        }
        setLoading(false);
      };

      fetchReceipt();
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-12 w-12 mx-auto rounded-full bg-gray-100"></div>
            <div className="h-6 w-3/4 mx-auto rounded bg-gray-100"></div>
            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-gray-100"></div>
              <div className="h-4 w-5/6 rounded bg-gray-100"></div>
              <div className="h-4 w-2/3 rounded bg-gray-100"></div>
            </div>
            <div className="h-10 w-full rounded-lg bg-gray-100 mt-6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5 }}
        className="max-w-130 w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center"
      >
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-50 mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        
        <motion.h2 
          variants={fadeIn}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          Payment Successful!
        </motion.h2>
        
        <motion.p 
          variants={fadeIn}
          transition={{ delay: 0.2 }}
          className="text-gray-600 mb-6"
        >
          Thank you for subscribing. Your account has been upgraded.
        </motion.p>

        {receipt && (
          <motion.div 
            variants={fadeIn}
            transition={{ delay: 0.3 }}
            className="mt-6 text-left p-6 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <Receipt className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900">Payment Receipt</h3>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Amount:</span>
                <span className="font-semibold text-gray-900">${receipt.amount_paid.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Date:</span>
                <span className="text-gray-700">
                  {new Date(receipt.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Reference ID:</span>
                <span className="font-mono text-blue-600 text-xs">{receipt.reference_id}</span>
              </div>
            </div>
            
            <div className="mt-5 pt-4 border-t border-gray-200 flex items-start gap-2">
              <Mail className="h-4 w-4 text-gray-500 mt-0.5" />
              <p className="text-xs text-gray-500">
                A receipt has been sent to <span className="font-medium text-gray-700">{receipt.email}</span>
              </p>
            </div>
          </motion.div>
        )}

        <motion.div 
          variants={fadeIn}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Button asChild className="w-full" size="lg">
            <Link href="/dashboard/home">
              Go to Dashboard
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}