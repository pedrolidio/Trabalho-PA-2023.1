'use client'
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AuthContext } from '@/contexts/AuthContext';
import api from '@/services/api';

import './styles.css';

export const cache = 'no-store';

export interface Order {
  id: number,
  user_id: number,
  status_id: number,
  cake_base_price: number,
  size_id: number,
  batter_id: number,
  filling_id_1: number,
  filling_id_2: number,
  decoration: string,
  order_date: string,
  delivery_date: string,
  delivery_price: number | null,
  address_id: number | null,
  pick_up: boolean,
  decoration_price: number | null,
  description: string | null
}

export interface Status {
  id: number,
  status: string
}

export interface Client {
  id: number,
  name: string,
  whatsapp: string
}

export interface Address {
  id: number,
  user_id: number,
  postal_code: string,
  street: string,
  number: string,
  complement: string,
  city: string,
  state: string,
  district: string
}

export interface CakeComponent {
  id: number,
  description: number,
  basePrice: number
}

export default function Management() {
  const { isAuthenticaded, user, loading } = useContext(AuthContext);
  const router = useRouter();

  const [ orders, setOrders ] = useState<Order[] | null>(null);
  const [ status, setStatus ] = useState<Status[] | null>(null);
  const [ clients, setClients ] = useState<Client[] | null>(null);
  const [ addresses, setAddresses ] = useState<Address[] | null>(null);

  const [ sizes, setSizes ] = useState<CakeComponent[] | null>(null);
  const [ batters, setBatters ] = useState<CakeComponent[] | null>(null);
  const [ fillings, setFillings ] = useState<CakeComponent[] | null>(null);

  useEffect(() => {
    api.get('orders/pending').then(response => {
      const { pending_orders, status, users, addresses } = response.data;

      setOrders(pending_orders);
      setStatus(status);
      setClients(users);
      setAddresses(addresses);
    });

    api.get('order/form').then(response => {
      const { sizes, batters, fillings } = response.data;

      setSizes(sizes);
      setBatters(batters);
      setFillings(fillings);
    });
  }, []);

  useEffect(() => {
    if(!loading && !isAuthenticaded)
      router.push('/login');
  }, [loading]);

  return (
    <main className='management-container'>
      <div className='title-container'>
        <h1>Gerenciamento de Pedidos</h1>
      </div>
      
      <div className="orders-container">
        {
          orders?.map((order)=>{
            return (
              <div 
                key={order.id}
                className='order-container'
              >
                <h3>{clients?.find(client => client.id === order.user_id)?.name} - Entrega: {order.delivery_date}</h3>
                <p>Whatsapp: {clients?.find(client => client.id === order.user_id)?.whatsapp}</p>
                
                <p>Tamanho: {sizes?.find(size => size.id === order.size_id)?.description}</p>
                <p>Massa: {batters?.find(batter => batter.id === order.batter_id)?.description}</p>
                <p>Recheio: {fillings?.find(filling => filling.id === order.filling_id_1)?.description}</p>
                {
                  order.size_id > 1 ? (
                    <p>Recheio: {fillings?.find(filling => filling.id === order.filling_id_2)?.description}</p>
                  ) : null
                }

                <p>Decoração: {order.decoration}</p>
                <p>Data do pedido: {order.order_date}</p>
                <p>Tipo de entrega: {order.pick_up ? "Retirada":"Entrega em domicílio"}</p>
                {
                  !order.pick_up ? (
                    <>
                      <br/>
                      <h4>Endereço de entrega</h4>
                      <p>CEP: {addresses?.find(address => address.id === order.address_id)?.postal_code}</p>
                      <p>Rua: {addresses?.find(address => address.id === order.address_id)?.street}</p>
                      <p>Numero: {addresses?.find(address => address.id === order.address_id)?.number}</p>
                      <p>Complemento: {addresses?.find(address => address.id === order.address_id)?.complement}</p>
                      <p>Bairro: {addresses?.find(address => address.id === order.address_id)?.district}</p>
                      <p>Cidade: {addresses?.find(address => address.id === order.address_id)?.city}</p>
                      <p>Estado: {addresses?.find(address => address.id === order.address_id)?.state}</p>
                    </>
                  ): null
                }

                <br />
                <p>Preço inicial: R$ {order.cake_base_price}</p>
              </div>
            );
          })
        }
      </div>
    </main>
  )
}
