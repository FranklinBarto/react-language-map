import React from 'react';

const InfoContainer = ({title,data}) => {
    if(title&&data){
        return (
            <section className='infoSection'>
            <span>{title}</span>
            <ul>
                {data&&Array.isArray(data)&&data.map(item=>(<li>{item}</li>))}
            </ul>
        </section>
    );
    }
    return("")
}

export default InfoContainer;
