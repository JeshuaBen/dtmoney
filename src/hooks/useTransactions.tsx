import { createContext, useState, useEffect, ReactNode, useContext } from 'react'
import { api } from '../services/api';

 
interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    createdAt: string;
}

type TransactionInput = Pick<Transaction, 'title' | 'amount' | 'type' | 'category'>
// O TransactionInput ele vai herdar todas as informações desse Transaction, porém omitindo o 'id' e o 'createdAt'

interface TransactionProviderProps {
    children: ReactNode;
    //O ReactNode aceita qualquer tipo de conteúdo válido para o react. (tags html, conteúdo jsx )
}

interface TransactionsContextData {
    transactions: Transaction [];
    createTransaction: (transaction : TransactionInput) => Promise<void>;
}



const TransactionsContext = createContext<TransactionsContextData>(
    {} as TransactionsContextData
    ); 
// Dentro dos parênteses, nós colocaremos o valor default dele, isto é, o valor que ele tem que inicializar.


export function TransactionProvider ({ children }: TransactionProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);


    useEffect(() => {
        api.get('transactions')
        .then (response => setTransactions(response.data.transactions))
    }, [])

    async function createTransaction (transactionInput : TransactionInput) {
        const response = await api.post('/transactions', {
            ...transactionInput,
            createdAt: new Date()
        })
        const { transaction } = response.data;

        setTransactions([
            ...transactions,
            transaction
        ])
        // Sempre que eu quero adicionar uma nova informação no vetor do estado no react, sempre copiarei todas as informações existentes e adiciono a nova informação
    }
    
    return (
        <TransactionsContext.Provider value={{ transactions, createTransaction}}>
            {children}
        </TransactionsContext.Provider>
    );
}


export function useTransactions() {
    const context = useContext(TransactionsContext)

    return context;
}