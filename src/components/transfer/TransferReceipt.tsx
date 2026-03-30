import { useRef, useState } from 'react'
import { CheckCircle, Download } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { TransferForm } from '@/pages/Transfer'
import * as htmlToImage from 'html-to-image'
import jsPDF from 'jspdf'

interface TransferReceiptProps {
  lastTransfer: TransferForm
  onReset: () => void
}

export function TransferReceipt({ lastTransfer, onReset }: TransferReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return
    setIsExporting(true)
    try {
      const dataUrl = await htmlToImage.toPng(receiptRef.current, {
        backgroundColor: '#0A0A0A',
        pixelRatio: 2
      })

      const pdfWidth = receiptRef.current.offsetWidth
      const pdfHeight = receiptRef.current.offsetHeight

      const pdfDoc = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [pdfWidth, pdfHeight]
      })

      pdfDoc.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdfDoc.save(`OndaFinance_Comprovante_${lastTransfer.recipientName.replace(/\s+/g, '_')}.pdf`)
    } catch (error) {
      console.error('Erro ao gerar PDF', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto animate-fade-in mt-4">
      <div
        ref={receiptRef}
        className="bg-surface rounded-2xl border border-border overflow-hidden shadow-2xl shadow-brand/10 p-[1px]"
      >
        <div className="bg-gradient-to-r from-gradient-start to-gradient-end p-8 text-center relative overflow-hidden rounded-t-[15px]">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20 shadow-inner">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Transferência Concluída!</h2>
          <p className="text-white/80 text-sm">Seu comprovante foi gerado com sucesso.</p>
        </div>

        <div className="p-8 bg-surface rounded-b-[15px]">
          <div className="flex items-center justify-center mb-8">
            <div className="text-center">
              <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Valor Enviado</p>
              <p className="text-4xl font-extrabold text-heading tracking-tight text-success">
                {formatCurrency(lastTransfer.amount)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-background rounded-xl p-5 text-left border border-border">
              {[
                ['Destinatário', lastTransfer.recipientName],
                ['CPF', lastTransfer.recipientCpf],
                ['Banco', lastTransfer.recipientBank || 'Onda Finance'],
                ['Instituição Origem', 'Onda Finance'],
                ...(lastTransfer.description ? [['Descrição', lastTransfer.description]] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm py-2.5 border-b border-border last:border-0 last:pb-0 first:pt-0">
                  <span className="text-muted font-medium">{label}</span>
                  <span className="font-bold text-heading text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <button
          onClick={handleDownloadPDF}
          disabled={isExporting}
          className="w-full flex items-center justify-center gap-2 h-12 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-all cursor-pointer shadow-lg shadow-brand/20 disabled:opacity-70"
        >
          <Download className="w-5 h-5" />
          {isExporting ? 'Gerando PDF...' : 'Baixar Comprovante PDF'}
        </button>
        <button
          onClick={onReset}
          className="w-full h-12 bg-surface text-heading border-2 border-border font-semibold rounded-xl hover:bg-background hover:border-brand/30 transition-all cursor-pointer shadow-sm"
        >
          Fazer outra transferência
        </button>
      </div>
    </div>
  )
}
