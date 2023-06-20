'use client'
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { FiMapPin } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';

import "react-datepicker/dist/react-datepicker.css";

import { AuthContext } from '@/contexts/AuthContext';
import api from '@/services/api';
import './styles.css';

export interface Cake {
  size_id: number,
  batter_id: number,
  filling1_id: number,
  filling2_id: number,
  decoration: string,
}

export interface Address {
  id: number,
  user_id: number,
  postal_code: string,
  street: string,
  number: string,
  complement: string | null,
  city: string,
  state: string,
}

export interface Delivery {
  pick_up: boolean,
  address_id: number | undefined,
  date: string,
}

export interface CakeComponent {
  id: number,
  description: number,
  basePrice: number
}

export default function CakeForm() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  const minDeliveryDate = new Date();
  minDeliveryDate.setDate(minDeliveryDate.getDate() + 7);

  const [ date, setDate ] = useState<Date | null>(minDeliveryDate);
  const [ sizes, setSizes ] = useState<CakeComponent[] | null>(null);
  const [ batters, setBatters ] = useState<CakeComponent[] | null>(null);
  const [ fillings, setFillings ] = useState<CakeComponent[] | null>(null);
  const [ cake, setCake ] = useState<Cake>({
    size_id: 2,
    batter_id: 1,
    filling1_id: 1,
    filling2_id: 1,
    decoration: "",
  });

  const [ addresses, setAddresses ] = useState<Address[] | null>(null);

  const [ delivery, setDelivery ] = useState<Delivery>({
    pick_up: true,
    address_id: undefined,
    date: minDeliveryDate.toLocaleDateString("pt-BR"),
  });

  const [ invalidDelivery, setInvalidDelivery ] = useState(false);

  const [ unavailableDates, setUnavailableDates ] = useState<Date[]>([]);

  const [ price, setPrice ] = useState(150);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(cake);
    console.log(delivery);

    if(!delivery.pick_up && addresses)
      if(addresses.length < 1)
      {
        setInvalidDelivery(true);
        return;
      }
        
    setInvalidDelivery(false);
    
    api.post('order', {
      cake,
      delivery
    });
    alert("Pedido realizado com sucesso!");
    router.push('/account/orders');
  }

  const calculatePrice = (cake: Cake) => {
    let price = 0;
    const size = sizes?.find(size => size.id == cake.size_id);
    const batter = batters?.find(batter => batter.id == cake.batter_id);
    const filling1 = fillings?.find(filling => filling.id == cake.filling1_id);
    const filling2 = fillings?.find(filling => filling.id == cake.filling2_id);
    let hasTwoFillings = false;

    if (size && batter && filling1)
    {
      price += size.basePrice + batter.basePrice + filling1.basePrice;
      hasTwoFillings = size.id >= 2 ? true : false;
    }

    if (filling2 && cake.filling1_id != cake.filling2_id && hasTwoFillings)
    {
      price += filling2.basePrice;
    }

    return price;
  }

  const BrazillianDate = (date: string) => {
    const splittedDate = date.split('/');

    return new Date(`${splittedDate[1]}/${splittedDate[0]}/${splittedDate[2]}`);
  }

  useEffect(() => {
    api.get('order/form').then(response => {
      const { sizes, batters, fillings, addresses, unavailableDates: disabledDates } = response.data;
      let unavailableDates = [] as Date[];

      setSizes(sizes);
      setBatters(batters);
      setFillings(fillings);
      setAddresses(addresses);
      if(addresses.length)
        setDelivery({ ...delivery, address_id: addresses[0].id })

      disabledDates.forEach((date: string) => unavailableDates.push(BrazillianDate(date)));

      setUnavailableDates(unavailableDates);
    });
  }, []);

  useEffect(() => {
    if(!loading)
      setPrice(calculatePrice(cake));
  }, [cake, loading]);

  return (
    <form className="cake-form" 
      onSubmit={e => onSubmit(e)}>
        <div className="cake-form-row">
          <div className="cake-form-column">
            <label>Tamanho</label>
            <select 
              value={cake.size_id} 
              onChange={e => setCake({...cake, size_id: parseInt(e.target.value)})}
              required
            >
              {
                sizes?.map((size)=>{
                  return (
                    <option value={size.id} key={size.id}>{size.description}</option>
                  );
                })
              }
            </select>
            
          </div>

          <div className="blank-divisor"/>
          
          <div className="cake-form-column">
            <label>Massa</label>
            <select 
              value={cake.batter_id} 
              onChange={e => setCake({...cake, batter_id: parseInt(e.target.value)})}
              required
            >
              {
                batters?.map((batter)=>{
                  return (
                    <option value={batter.id} key={batter.id}>{batter.description}</option>
                  );
                })
              }
            </select>
          </div>
        </div>

        <div className="cake-form-row">
          <div className="cake-form-column">
            <label>Primeira opção de recheio</label>
            <select 
              value={cake.filling1_id} 
              onChange={e => setCake({...cake, filling1_id: parseInt(e.target.value)})}
              required
            >
              {
                fillings?.map((filling)=>{
                  return (
                    <option value={filling.id} key={filling.id}>{filling.description}</option>
                  );
                })
              }
            </select>
          </div>

          <div className="blank-divisor"/>

          <div className="cake-form-column">
            <label>Segunda opção de recheio</label>
            <select 
              value={cake.size_id < 2 ? cake.filling1_id : cake.filling2_id} 
              onChange={e => setCake({...cake, filling2_id: parseInt(e.target.value)})}
              disabled={cake.size_id < 2 ? true : false}
              required
            >
              {
                fillings?.map((filling)=>{
                  return (
                    <option value={filling.id} key={filling.id}>{filling.description}</option>
                  );
                })
              }
            </select>
          </div>
        </div>

        <label>Decoração</label>
        <textarea 
          placeholder="Descreva como deverá ser a decoração"
          value={cake.decoration} 
          onChange={e => setCake({...cake, decoration: e.target.value})}
          required
        />

        <div className="cake-form-row">
          <div className="cake-form-column">
            <label>Tipo de entrega</label>
            <select 
              onChange={e => {
                setDelivery({...delivery, pick_up: parseInt(e.target.value) == 0})
                setInvalidDelivery(false);
              }}
              required
            >
              <option value={0}>Retirar no local</option>
              <option value={1}>Receber em casa</option>
            </select>
          </div>

          <div className="blank-divisor"/>

          <div className="cake-form-column">
            {
              delivery.pick_up ? (
                <>
                  <label>Endereço de retirada</label>
                  <a href="https://goo.gl/maps/Xd2HGSWV54TnnTmZ8" target="_blank" className="link">
                    <FiMapPin size={16} color="#F48192"/>
                    Ver localização no mapa
                  </a>
                </>
              ) : (
                <>
                  <label>Endereço de entrega</label>
                  <select 
                    value={delivery.address_id} 
                    onChange={e => setDelivery({...delivery, address_id: parseInt(e.target.value)})}
                    disabled={addresses ? (addresses.length > 0 ? false : true) : true}
                    required
                  >
                    {
                      addresses ? ( 
                        addresses.length > 0 ? (
                          addresses?.map((address)=>{
                            return (
                              <option value={address.id} key={address.id}>{`${address.street}, ${address.number}`}</option>
                            );
                        })) : (
                          <option value={0}>Sem endereços cadastrados</option>
                      )) : null
                    }
                  </select>
                </>
              )
            }
          </div>
        </div>

        {
          invalidDelivery ? (
            <label className="error-label">
              * Você deve cadatrar ao menos um endereço de entrega!
            </label>
          ) : (
            null
          )
        }

        <div className="cake-form-row">
          <div className="cake-form-column">
            <label>Data de entrega</label>
            <DatePicker 
              locale={ptBR}
              dateFormat="dd/MM/yyyy"
              selected={date} 
              onChange={date => {
                setDate(date);
                setDelivery({
                  ...delivery, 
                  date: date ? date.toLocaleDateString("pt-BR") : ""});
              }}
              minDate={minDeliveryDate}
              excludeDates={unavailableDates}
              required
            />
          </div>
          
          <div className="blank-divisor"/>

          <div className="cake-form-column">
            <label>Preço estimado:</label>
            <span style={{fontWeight: "bold", alignSelf: "center", marginTop: "10px"}}>R$ {price} + decoração{
            !delivery.pick_up ? " e entrega" : ""
            }</span>
          </div>
        </div>

        <button 
          type="submit" 
          className="button"
        >
          Encomendar bolo
        </button>
      </form>
  )
}
