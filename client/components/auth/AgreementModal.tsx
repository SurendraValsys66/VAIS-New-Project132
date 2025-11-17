import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface AgreementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function AgreementModal({
  open,
  onOpenChange,
  onConfirm,
}: AgreementModalProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasRead, setHasRead] = useState(false);
  const [hasUnderstood, setHasUnderstood] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  const documentUrl =
    "https://cdn.builder.io/o/assets%2Fb84737c2f01348ecb1782b11d83745b5%2F00ba7936a5764e189c3bf45a8b83548b?alt=media&token=f3760bd2-328f-4368-9fb3-f52efac7ae38&apiKey=b84737c2f01348ecb1782b11d83745b5";

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfError(false);
  };

  const onDocumentLoadError = () => {
    setPdfError(true);
  };

  const allCheckboxesChecked = hasRead && hasUnderstood && hasAgreed;

  const handleConfirm = () => {
    if (allCheckboxesChecked) {
      onConfirm();
      onOpenChange(false);
      // Reset state for next time
      setTimeout(() => {
        setHasRead(false);
        setHasUnderstood(false);
        setHasAgreed(false);
        setCurrentPage(1);
      }, 300);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-valasys-orange/5 to-transparent">
          <DialogTitle className="text-2xl font-bold text-valasys-gray-900">
            Master Subscriber Agreement
          </DialogTitle>
          <DialogDescription className="mt-2 text-valasys-gray-600">
            Please review the document and confirm your understanding before
            proceeding
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* PDF Viewer */}
          <div className="flex-1 overflow-auto bg-valasys-gray-50 border-b flex flex-col items-center p-4">
            {pdfError ? (
              <div className="flex items-center justify-center h-full w-full flex-col space-y-4">
                <div className="flex items-center space-x-3 bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <div className="text-sm text-red-700">
                    <p className="font-semibold">Unable to load document</p>
                    <p className="text-xs mt-1">
                      The PDF viewer is temporarily unavailable. Please refresh
                      the page and try again.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow-md border border-valasys-gray-200 overflow-hidden">
                  <Document
                    file={documentUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                      <div className="h-96 w-96 flex items-center justify-center bg-white rounded-lg">
                        <div className="text-center">
                          <div className="inline-block">
                            <div className="w-8 h-8 border-4 border-valasys-orange border-t-transparent rounded-full animate-spin"></div>
                          </div>
                          <p className="mt-4 text-valasys-gray-600 text-sm">
                            Loading document...
                          </p>
                        </div>
                      </div>
                    }
                  >
                    <Page
                      pageNumber={currentPage}
                      scale={1.5}
                      renderTextLayer={true}
                    />
                  </Document>
                </div>

                {numPages && numPages > 1 && (
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          prev > 1 ? prev - 1 : prev
                        )
                      }
                      disabled={currentPage === 1}
                      className="gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <span className="text-sm font-medium text-valasys-gray-700">
                      Page {currentPage} of {numPages}
                    </span>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          prev < numPages ? prev + 1 : prev
                        )
                      }
                      disabled={currentPage === numPages}
                      className="gap-2"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Checkboxes Section */}
          <div className="px-6 py-6 border-t bg-white space-y-4">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-valasys-gray-900">
                Please confirm the following:
              </p>

              <div className="flex items-start space-x-3 p-3 rounded-lg bg-valasys-blue/5 border border-valasys-blue/20">
                <Checkbox
                  id="hasRead"
                  checked={hasRead}
                  onCheckedChange={(checked) => setHasRead(checked === true)}
                  className="mt-0.5"
                />
                <label
                  htmlFor="hasRead"
                  className="text-sm text-valasys-gray-700 flex flex-col space-y-1 cursor-pointer"
                >
                  <span className="font-medium">
                    I have read the entire agreement
                  </span>
                </label>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg bg-valasys-green/5 border border-valasys-green/20">
                <Checkbox
                  id="hasUnderstood"
                  checked={hasUnderstood}
                  onCheckedChange={(checked) =>
                    setHasUnderstood(checked === true)
                  }
                  className="mt-0.5"
                />
                <label
                  htmlFor="hasUnderstood"
                  className="text-sm text-valasys-gray-700 flex flex-col space-y-1 cursor-pointer"
                >
                  <span className="font-medium">
                    I have understood all the terms and conditions
                  </span>
                </label>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg bg-valasys-orange/5 border border-valasys-orange/20">
                <Checkbox
                  id="hasAgreed"
                  checked={hasAgreed}
                  onCheckedChange={(checked) => setHasAgreed(checked === true)}
                  className="mt-0.5"
                />
                <label
                  htmlFor="hasAgreed"
                  className="text-sm text-valasys-gray-700 flex flex-col space-y-1 cursor-pointer"
                >
                  <span className="font-medium">
                    I agree to the Master Subscriber Agreement
                  </span>
                  <span className="text-xs text-red-600 font-semibold">
                    All three confirmations required
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t px-6 py-4 flex gap-3 justify-end bg-valasys-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-valasys-gray-300 text-valasys-gray-700 hover:bg-valasys-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!allCheckboxesChecked}
              className={`font-medium transition-all duration-200 ${
                allCheckboxesChecked
                  ? "bg-valasys-orange hover:bg-valasys-orange-light text-white"
                  : "bg-valasys-gray-200 text-valasys-gray-500 cursor-not-allowed"
              }`}
            >
              {allCheckboxesChecked ? "I Accept & Continue" : "Complete All Confirmations"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
