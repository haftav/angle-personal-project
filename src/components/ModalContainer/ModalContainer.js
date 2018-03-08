import React from 'react';
import ModalInfo from '../ModalInfo/ModalInfo';
import ModalProject from '../ModalProject/ModalProject';
import './ModalContainer.css';

export default function ModalContainer({ toggleModal, active, info, project, update }) {
    console.log(info);
    return (
        <div>
            <div className={active ? 'modal-container modal-container-active' : 'modal-container'}>
            </div>
            {
                info ? 
                <ModalInfo toggleModal={toggleModal} active={active}/>
                :
                <ModalProject toggleModal={toggleModal} 
                active={active} 
                project={project} 
                update={update} />

            }
        </div>
    )
}