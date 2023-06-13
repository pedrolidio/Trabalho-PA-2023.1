'use client'
import { useState, useEffect } from 'react';
import { FiMapPin } from 'react-icons/fi';

import './styles.css';

import { sizes, batters, fillings, specialFillings, 
         specialFillingPrice, addresses, pickUpAdressLink } from '@/testingData';

export interface Cake {
  size: number,
  batter: number,
  filling1: number,
  filling2: number,
  decoration: string,
}

export interface Delivery {
  type: number,
  client: number,
  address: number,
  date: number,
}

export default function CakeForm() {
  const [ cake, setCake ] = useState<Cake>({
    size: 15,
    batter: 0,
    filling1: 0,
    filling2: 0,
    decoration: "",
  });

  const [ delivery, setDelivery ] = useState<Delivery>({
    type: 0,
    client: 0,
    address: 0,
    date: 0,
  });

  const [ price, setPrice ] = useState(80);

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    console.log(cake);
    console.log(delivery);
    // console.log(minDeliveryDateFormatted);
  }

  const calculatePrice = (cake: Cake) => {
    let price = 0;
    const size = sizes.find(size => size.value == cake.size);

    if (size)
    {
      price += size.basePrice;
    }

    if (specialFillings.includes(cake.filling1))
    {  
      price += specialFillingPrice;
    }

    if (specialFillings.includes(cake.filling2) && cake.filling1 != cake.filling2 && cake.size >= 15)
    {
      price += specialFillingPrice;
    }

    return price;
  }

  useEffect(() => {
    setPrice(calculatePrice(cake));
  }, [cake])

  return (
    <form className="cake-form">
        <div>
          <div>
            <label>Tamanho</label>
            <select value={cake.size} onChange={e => setCake({...cake, size: parseInt(e.target.value)})}>
              {
                sizes.map((size)=>{
                  return (
                    <option value={size.value} key={size.value}>{size.name}</option>
                  );
                })
              }
            </select>
            
          </div>

          <div className="blank-divisor"/>
          
          <div>
            <label>Massa</label>
            <select value={cake.batter} onChange={e => setCake({...cake, batter: parseInt(e.target.value)})}>
              {
                batters.map((batter)=>{
                  return (
                    <option value={batter.id} key={batter.id}>{batter.name}</option>
                  );
                })
              }
            </select>
          </div>
        </div>

        <div>
          <div>
            <label>Primeira opção de recheio</label>
            <select 
              value={cake.filling1} 
              onChange={e => setCake({...cake, filling1: parseInt(e.target.value)})}
            >
              {
                fillings.map((filling)=>{
                  return (
                    <option value={filling.id} key={filling.id}>{filling.name}</option>
                  );
                })
              }
            </select>
          </div>

          <div className="blank-divisor"/>

          <div>
            <label>Segunda opção de Recheio</label>
            <select 
              value={cake.size < 15 ? cake.filling1 : cake.filling2} 
              onChange={e => setCake({...cake, filling2: parseInt(e.target.value)})}
              disabled={cake.size < 15 ? true : false}
            >
              {
                fillings.map((filling)=>{
                  return (
                    <option value={filling.id} key={filling.id}>{filling.name}</option>
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
        />

        <div>
          <div>
            <label>Tipo de entrega</label>
            <select value={delivery.type} onChange={e => setDelivery({...delivery, type: parseInt(e.target.value)})}>
              <option value={0}>Retirar no local</option>
              <option value={1}>Receber em casa</option>
            </select>
          </div>

          <div className="blank-divisor"/>

          <div>
            {
              delivery.type == 0 ? (
                <>
                  <label>Endereço de Retirada</label>
                  <a href={pickUpAdressLink} target="_blank" className="link">
                    <FiMapPin size={16} color="#F48192"/>
                    Ver localização no mapa
                  </a>
                </>
              ) : (
                <>
                  <label>Endereço de Entrega</label>
                  <select 
                    value={delivery.address} 
                    onChange={e => setDelivery({...delivery, address: parseInt(e.target.value)})}
                    disabled={addresses.length > 0 ? false : true}
                  >
                    {
                      addresses.length > 0 ? (
                        addresses.map((address)=>{
                          return (
                            <option value={address.id} key={address.id}>{address.name}</option>
                          );
                      })) : (
                        <option value={0}>Sem endereços cadastrados</option>
                      )
                    }
                  </select>
                </>
              )
            }
          </div>
        </div>

        <div>
          <div>
            <label>Data de entrega</label>
            <input type="date" min="2023-06-15"/>
          </div>
          
          <div className="blank-divisor"/>

          <div>
            <label>Preço estimado:</label>
            <span style={{fontWeight: "bold", alignSelf: "center", marginTop: "10px"}}>R$ {price} + decoração{
            delivery.type == 1 ? " e entrega" : ""
            }</span>
          </div>
        </div>

        <button 
          type="submit" 
          className="button"
          onClick={e => onSubmit(e)}
        >
          Encomendar bolo
        </button>
      </form>
  )
}
