import React from 'react';
import ModalInfo from '../ModalInfo/ModalInfo';

export default function ModalContainer({ toggleModal, active }) {

    return (
        <div>
            <div className={active ? 'modal-container modal-container-active' : 'modal-container'}>
            </div>
            <ModalInfo toggleModal={toggleModal} active={active}/>
        </div>
    )
}