import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SwitchWithLabel from '@/components/custom/SwitchWithLabel';

interface MyTableProps {
  headers: string[];
  rows: (string | number | boolean)[][]; 
  removeColumn?: boolean;
  onRemoveRow?: (index: number) => void;
  confirmOnRemove?: boolean;
  ids?: number[]; 
  onDeactivateRow?: (id: number) => void;
  onActivateRow?: (id: number) => void;
  eliminatedRows?: boolean[]; 
  activado?: boolean;
  isRowClickable?: boolean; // Agregar esta propiedad
  onRowClick?: (index: number) => void; // Callback cuando se haga clic en la fila
}

const MyTable: React.FC<MyTableProps> = ({
  headers,
  rows,
  removeColumn,
  onRemoveRow,
  confirmOnRemove = false,
  ids,
  onDeactivateRow,
  onActivateRow,
  eliminatedRows = [],
  activado = true,
  isRowClickable = false, // Valor por defecto en false
  onRowClick // Función que manejará el clic en la fila
}) => {
  const [confirmIndex, setConfirmIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableRows, setTableRows] = useState<(string | number | boolean)[][]>(rows);

  const rowsPerPage = 10;
  const totalPages = Math.ceil(tableRows.length / rowsPerPage);

  useEffect(() => {
    setTableRows(rows);
  }, [rows]);

  const handleRowClick = (index: number) => {
    if (isRowClickable && onRowClick) {
      onRowClick(index); // Llamar al callback si la fila es clickeable
    }
  };

  const handleRemoveClick = (index: number) => {
    if (confirmOnRemove) {
      setConfirmIndex(index);
    } else {
      onRemoveRow?.(index);
    }
  };

  const handleSwitchChange = async (rowIndex: number, newValue: boolean) => {
    const rowId = ids && ids[rowIndex];

    if (!rowId) {
      console.error('Missing id');
      alert('ID faltante');
      return;
    }

    const updatedRows = tableRows.map((row, index) =>
      index === rowIndex
        ? row.map(cell => typeof cell === 'boolean' ? newValue : cell)
        : row
    );
    setTableRows(updatedRows);

    try {
      if (newValue) {
        if (onActivateRow) {
          await onActivateRow(rowId);
          activado && alert('Activado');
        }
      } else {
        if (onDeactivateRow) {
          await onDeactivateRow(rowId);
          activado && alert('Desactivado');
        }
      }
    } catch (error) {
      console.error("Error updating state:", error);
      alert("Error al actualizar el estado");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const startRow = (currentPage - 1) * rowsPerPage;
  const currentRows = tableRows.slice(startRow, startRow + rowsPerPage);

  const handleConfirmClick = (index: number) => {
    // Lógica para manejar la confirmación
    console.log('Confirmar fila en el índice:', index);
    onRemoveRow?.(index); // Eliminar la fila, si es necesario
    setConfirmIndex(null); // Cerrar el diálogo de confirmación
  };

  return (
    <div className="table-container">
      <Table className="bg-white rounded relative">
        <TableHeader className="bg-gray-3">
          <TableRow className="hover:bg-gray-3">
            {headers.map((header, index) => (
              <TableHead key={index} className="text-center text-white">
                {header}
              </TableHead>
            ))}
            {removeColumn && <TableHead className="text-center text-white">Eliminar</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentRows.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className={eliminatedRows[startRow + rowIndex] ? 'bg-red hover:bg-red' : ''}
              onClick={() => handleRowClick(startRow + rowIndex)} // Hacer clic en la fila
              style={{ cursor: isRowClickable ? 'pointer' : 'default' }} // Cambiar cursor solo si es clickeable
            >
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className="text-center">
                  {typeof cell === 'boolean' ? (
                    <SwitchWithLabel
                      label=""
                      insideTable={true}
                      isActive={cell}
                      onCheckedChange={(newValue) => handleSwitchChange(startRow + rowIndex, newValue)}
                    />
                  ) : (
                    cell
                  )}
                </TableCell>
              ))}
              {removeColumn && (
                <TableCell className="text-center p-2">
                  {confirmOnRemove && confirmIndex === startRow + rowIndex ? (
                    <button
                      onClick={() => handleConfirmClick(startRow + rowIndex)}
                      className="text-white text-lg bg-red rounded p-1"
                    >
                      Confirmar
                    </button>
                  ) : (
                    !eliminatedRows[startRow + rowIndex] && (
                      <button
                        onClick={() => handleRemoveClick(startRow + rowIndex)}
                        className="text-red text-3xl"
                      >
                        ×
                      </button>
                    )
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination controls */}
      {totalPages > 1 &&
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-3 rounded disabled:opacity-50 text-white"
          >
            Anterior
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-3 rounded disabled:opacity-50 text-white"
          >
            Siguiente
          </button>
        </div>
      }
    </div>
  );
};

export default MyTable;
