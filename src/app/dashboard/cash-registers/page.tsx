// src/app/dashboard/cash-registers/page.tsx
'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PlusCircle, PlayCircle, StopCircle, History, Loader2, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { useShopData } from '@/context/store-context';
import { useAuth } from '@/context/auth-context';
import { ICashRegisterSession } from '@/types/cash-register-session.interface';
import { ICashRegister } from '@/types/cash-register.interface';

export default function CashRegistersPage() {
  const {
    cashRegisters: currentStoreCashRegisters,
    isLoading,
    loadInitialData,
    setOpenSession,
  } = useShopData();
  const { storeContext: user } = useAuth();

  const [isOpeningSession, setIsOpeningSession] = React.useState(false);
  const [selectedRegister, setSelectedRegister] = React.useState<ICashRegister | null>(null);
  const [initialCash, setInitialCash] = React.useState<string>('');
  const [isProcessingSession, setIsProcessingSession] = React.useState(false);

  const [showHistoryModal, setShowHistoryModal] = React.useState(false);
  const [historyRegisterId, setHistoryRegisterId] = React.useState<number | null>(null);
  const [registerHistory, setRegisterHistory] = React.useState<ICashRegisterSession[]>([]);
  const [isFetchingHistory, setIsFetchingHistory] = React.useState(false);

  const [isClosingModalOpen, setIsClosingModalOpen] = React.useState(false);
  const [closingSession, setClosingSession] = React.useState<ICashRegisterSession | null>(null);
  const [closingAmount, setClosingAmount] = React.useState('');

  // Filtrer les caisses pour la boutique actuelle
  // const currentStoreCashRegisters = React.useMemo(() => {
  //   return cashRegisters.filter(cr => cr.storeId === currentStore?.id);
  // }, [cashRegisters, currentStore]);

  // Ouvrir une session de caisse
  const handleOpenSession = async () => {
    if (!selectedRegister || !initialCash.trim()) {
      toast.error('Please select a cash register and enter an opening amount.');
      return;
    }

    const initialAmount = parseFloat(initialCash);
    if (isNaN(initialAmount) || initialAmount < 0) {
      toast.error('Opening amount must be greater than 0.');
      return;
    }

    setIsProcessingSession(true);
    try {
      const response = await api.post(`store/${user?.storeId}/cash-register-sessions/open`, {
        cashRegisterId: selectedRegister?.id,
        initialCash: initialAmount,
      });
      console.log(`response ${JSON.stringify(response.data)}`);
      localStorage.setItem('openSession', JSON.stringify(response.data));
      setOpenSession(response.data);
      toast.success(
        `Cash register session open for ${selectedRegister?.name} with ${initialAmount.toLocaleString()} XAF.`
      );
      loadInitialData(); // Rafraîchir les données
      setIsOpeningSession(false);
      setSelectedRegister(null);
      setInitialCash('');
    } catch (error) {
      console.error("Erreur lors de l'ouverture de session:", error);
      toast.error('Failed to open cash register session.');
    } finally {
      setIsProcessingSession(false);
    }
  };

  // Fermer une session de caisse
  // const handleCloseSession = async (session: ICashRegisterSession) => {
  //   if (!session || session.status === 'closed') return;

  //   console.log(`session ouverte ${JSON.stringify(session)}`);

  //   const closingAmount = prompt(`Confirm the closing amount ${session.id}`);
  //   if (closingAmount === null) return; // Annulé par l'utilisateur

  //   const finalClosingAmount = parseFloat(closingAmount);
  //   if (isNaN(finalClosingAmount) || finalClosingAmount < 0) {
  //     toast.error('The closing amount must be greater than 0');
  //     return;
  //   }

  //   setIsProcessingSession(true);
  //   try {
  //     await api.post(`store/${user?.storeId}/cash-register-sessions/${session.id}/close`, {
  //       // sessionId: session.id,
  //       finalCash: finalClosingAmount,
  //       // closedByStoreUserId: user?.s, // Assurez-vous que l'ID de l'utilisateur est envoyé
  //     });
  //     toast.success(
  //       `Casg=h register session ${session.id} closed with ${finalClosingAmount.toLocaleString()} XAF.`
  //     );
  //     loadInitialData(); // Rafraîchir les données
  //   } catch (error) {
  //     console.error('Erreur lors de la fermeture de session:', error);
  //     toast.error('Failed to close cash register session.');
  //   } finally {
  //     setIsProcessingSession(false);
  //   }
  // };

  const handleCloseSession = (session: ICashRegisterSession) => {
    if (!session || session.status === 'closed') return;
    setClosingSession(session);
    setClosingAmount('');
    setIsClosingModalOpen(true);
  };

  const confirmCloseSession = async () => {
    if (!closingSession) return;

    const finalAmount = parseFloat(closingAmount);
    if (isNaN(finalAmount) || finalAmount < 0) {
      toast.error('The closing amount must be greater than 0');
      return;
    }

    setIsProcessingSession(true);
    try {
      await api.post(`store/${user?.storeId}/cash-register-sessions/${closingSession.id}/close`, {
        finalCash: finalAmount,
      });
      toast.success(
        `Cash register session ${closingSession.id} closed with ${finalAmount.toLocaleString()} XAF.`
      );
      loadInitialData();
      setIsClosingModalOpen(false);
      setClosingSession(null);
      localStorage.removeItem('openSession');
      setClosingAmount('');
    } catch (error) {
      console.error('Error closing session:', error);
      toast.error('Failed to close cash register session.');
    } finally {
      setIsProcessingSession(false);
    }
  };

  // Récupérer l'historique des sessions pour une caisse spécifique
  const fetchRegisterHistory = async (registerId: number) => {
    setIsFetchingHistory(true);
    try {
      const response = await api.get(`store/${user?.storeId}/cash-register/${registerId}/history`);
      setRegisterHistory(response.data);
      setHistoryRegisterId(registerId);
      setShowHistoryModal(true);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique:", error);
      toast.error('Failed to fetch history');
    } finally {
      setIsFetchingHistory(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 md:ml-64 min-h-screen bg-gray-50 dark:bg-gray-950 px-6 py-4">
        <h1 className="text-3xl font-bold text-gray-900">Management of Cash registers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded mt-4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:ml-64 min-h-screen bg-gray-50 dark:bg-gray-950 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Management of Cash registers</h1>
          <p className="text-gray-500 mt-1">Manage your cash regiaters.</p>
        </div>
        <Button onClick={() => setIsOpeningSession(true)} className="flex items-center">
          <PlusCircle className="w-4 h-4 mr-2" />
          Open a new session
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentStoreCashRegisters.map((register) => (
          <Card key={register?.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {register?.name}
              </CardTitle>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  register?.currentOpenSession?.status === 'open'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {register?.currentOpenSession?.status === 'open' ? 'Open' : 'Closed / Inactive'}
              </span>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">Location: {register?.store?.name}</p>
              {register?.currentOpenSession?.status === 'open' ? (
                <div className="text-sm text-gray-700">
                  <p className="flex items-center mt-1">
                    <PlayCircle className="w-4 h-4 mr-2 text-green-500" />
                    Opened at:{' '}
                    {format(new Date(register?.currentOpenSession.openedAt), 'dd/MM/yyyy HH:mm', {
                      locale: fr,
                    })}
                  </p>
                  <p className="flex items-center mt-1">
                    <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
                    Initial sales: {register?.currentOpenSession.initialCash.toLocaleString()} XAF
                  </p>
                  {/* {register?.currentOpenSession. !== undefined && (
                    <p className="flex items-center mt-1 font-bold text-primary">
                      <DollarSign className="w-4 h-4 mr-2 text-primary" />
                      Solde actuel: {register?.currentOpenSession.currentCash.toLocaleString()} XAF
                    </p>
                  )} */}
                  <Button
                    onClick={() => handleCloseSession(register.currentOpenSession!)}
                    disabled={isProcessingSession}
                    className="w-full mt-4 bg-red-500 hover:bg-red-600"
                  >
                    {isProcessingSession ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <StopCircle className="w-4 h-4 mr-2" />
                    )}
                    Close session
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setSelectedRegister(register);
                    setInitialCash(''); // Reset initial cash input
                    setIsOpeningSession(true);
                  }}
                  disabled={isProcessingSession}
                  className="w-full mt-4"
                >
                  {isProcessingSession && selectedRegister?.id === register?.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <PlayCircle className="w-4 h-4 mr-2" />
                  )}
                  Open session
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => fetchRegisterHistory(register?.id)}
                disabled={isFetchingHistory}
                className="w-full mt-2 flex items-center"
              >
                {isFetchingHistory && historyRegisterId === register?.id ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <History className="w-4 h-4 mr-2" />
                )}
                View History
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Modal pour fermer une session */}

      <Dialog open={isClosingModalOpen} onOpenChange={setIsClosingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Cash Register Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Please enter the closing amount for session #{closingSession?.id}
            </p>
            <Input
              type="number"
              value={closingAmount}
              onChange={(e) => setClosingAmount(e.target.value)}
              placeholder="Ex: 45000"
              min="0"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClosingModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmCloseSession} disabled={isProcessingSession}>
              {isProcessingSession ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <StopCircle className="w-4 h-4 mr-2" />
              )}
              Confirm Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal pour ouvrir une session */}
      <Dialog open={isOpeningSession} onOpenChange={setIsOpeningSession}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open a cash register session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="register-select"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select a cash register
              </label>
              <select
                id="register-select"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                value={selectedRegister?.id || ''}
                onChange={(e) => {
                  const regId = parseInt(e.target.value);
                  setSelectedRegister(
                    currentStoreCashRegisters.find((r) => r.id === regId) || null
                  );
                }}
              >
                <option value="">-- Select a cash register --</option>
                {currentStoreCashRegisters
                  .filter(
                    (cr) => !cr.currentOpenSession || cr.currentOpenSession.status === 'closed'
                  )
                  .map((register) => (
                    <option key={register?.id} value={register?.id}>
                      {register?.name} ({register?.store?.name})
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="initial-cash"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Initial Amount (XAF)
              </label>
              <Input
                id="initial-cash"
                type="number"
                value={initialCash}
                onChange={(e) => setInitialCash(e.target.value)}
                placeholder="Ex: 50000"
                min="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpeningSession(false)}>
              Cancel
            </Button>
            <Button onClick={handleOpenSession} disabled={isProcessingSession}>
              {isProcessingSession ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle className="mr-2 h-4 w-4" />
              )}
              Open session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modal pour l'historique des sessions */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Cash register session hisory (
              {currentStoreCashRegisters.find((cr) => cr.id === historyRegisterId)?.name})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {registerHistory?.length === 0 ? (
              <p className="text-gray-500 text-center">No history for this cash register</p>
            ) : (
              registerHistory.map((session) => (
                <Card key={session.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Session ID: {session.id}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          session.status === 'open'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {session.status === 'open' ? 'Ouverte' : 'Fermée'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Opened by: {session.openedBy?.user?.fullName || 'N/A'} le{' '}
                      {format(new Date(session.openedAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </p>
                    <p className="text-sm text-gray-700">
                      Initial Amount: {session.initialCash.toLocaleString()} XAF
                    </p>
                    {session.status === 'closed' && (
                      <>
                        <p className="text-sm text-gray-700">
                          Closed by: {session.closedBy?.user?.fullName || 'N/A'} le{' '}
                          {format(new Date(session.closedAt!), 'dd/MM/yyyy HH:mm', { locale: fr })}
                        </p>
                        <p className="text-sm text-gray-700 font-medium">
                          Montant de clôture: {session.closingCash?.toLocaleString() || 'N/A'} XAF
                        </p>
                        <p
                          className={`text-sm font-bold ${
                            (session.closingCash || 0) - (session.initialCash || 0) < 0
                              ? 'text-red-600'
                              : 'text-green-600'
                          }`}
                        >
                          Balance: {session.discrepancy.toLocaleString()} XAF
                        </p>
                      </>
                    )}
                    <p className="text-sm text-gray-700">
                      {/* Nombre de ventes: {session. || 0} */}
                    </p>
                    <p className="text-sm text-gray-700 font-semibold">
                      Total sales:{' '}
                      {((session.closingCash || 0) - (session.initialCash || 0)).toLocaleString()}{' '}
                      XAF
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowHistoryModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
