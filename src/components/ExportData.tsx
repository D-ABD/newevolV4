import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Share2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import type { Entry, Category } from '../types';

interface ExportDataProps {
  entries: Entry[];
  categories: Category[];
}

export function ExportData({ entries, categories }: ExportDataProps) {
  const exportToJSON = () => {
    const data = {
      entries,
      categories,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Données exportées avec succès !');
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Contenu', 'Catégorie', 'Humeur', 'Public'];
    const csvData = entries.map(entry => [
      new Date(entry.timestamp).toLocaleDateString(),
      `"${entry.content.replace(/"/g, '""')}"`,
      categories.find(c => c.id === entry.category)?.name || entry.category,
      entry.mood,
      entry.isPublic ? 'Oui' : 'Non'
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Données exportées en CSV !');
  };

  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Journal de Progression</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .entry { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            .entry-date { font-weight: bold; color: #666; }
            .entry-content { margin: 10px 0; }
            .entry-meta { font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Journal de Progression</h1>
            <p>Exporté le ${new Date().toLocaleDateString()}</p>
          </div>
          ${entries.map(entry => `
            <div class="entry">
              <div class="entry-date">${new Date(entry.timestamp).toLocaleDateString()}</div>
              <div class="entry-content">${entry.content}</div>
              <div class="entry-meta">
                Catégorie: ${categories.find(c => c.id === entry.category)?.name || entry.category} | 
                Humeur: ${entry.mood}/10
              </div>
            </div>
          `).join('')}
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
    
    toast.success('PDF généré pour impression !');
  };

  const shareData = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mon Journal de Progression',
          text: `J'ai enregistré ${entries.length} moments de progression !`,
          url: window.location.href
        });
        toast.success('Partagé avec succès !');
      } catch (error) {
        toast.error('Erreur lors du partage');
      }
    } else {
      navigator.clipboard.writeText(`J'ai enregistré ${entries.length} moments de progression ! ${window.location.href}`);
      toast.success('Lien copié dans le presse-papiers !');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Download className="w-6 h-6 mr-2 text-purple-500" />
        Exporter vos données
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportToJSON}
          className="flex items-center justify-center p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors"
        >
          <FileText className="w-6 h-6 mr-3 text-purple-600" />
          <div className="text-left">
            <div className="font-medium">Exporter en JSON</div>
            <div className="text-sm text-gray-500">Format complet avec métadonnées</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportToCSV}
          className="flex items-center justify-center p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
        >
          <Calendar className="w-6 h-6 mr-3 text-green-600" />
          <div className="text-left">
            <div className="font-medium">Exporter en CSV</div>
            <div className="text-sm text-gray-500">Compatible Excel/Sheets</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportToPDF}
          className="flex items-center justify-center p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <FileText className="w-6 h-6 mr-3 text-blue-600" />
          <div className="text-left">
            <div className="font-medium">Imprimer/PDF</div>
            <div className="text-sm text-gray-500">Version imprimable</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={shareData}
          className="flex items-center justify-center p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors"
        >
          <Share2 className="w-6 h-6 mr-3 text-orange-600" />
          <div className="text-left">
            <div className="font-medium">Partager</div>
            <div className="text-sm text-gray-500">Partager vos progrès</div>
          </div>
        </motion.button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Statistiques d'export</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total d'entrées:</span>
            <span className="font-medium ml-2">{entries.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Catégories:</span>
            <span className="font-medium ml-2">{categories.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Première entrée:</span>
            <span className="font-medium ml-2">
              {entries.length > 0 ? new Date(Math.min(...entries.map(e => new Date(e.timestamp).getTime()))).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Dernière entrée:</span>
            <span className="font-medium ml-2">
              {entries.length > 0 ? new Date(Math.max(...entries.map(e => new Date(e.timestamp).getTime()))).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}