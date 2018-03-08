import React from 'react';
import ModalInfo from '../ModalInfo/ModalInfo';
import ModalProject from '../ModalProject/ModalProject';
import ModalDelete from '../ModalDelete/ModalDelete';
import './ModalContainer.css';

export default function ModalContainer({ toggleModal, active, info, project, update }) {
    return (
        <div>
            <div className={active ? 'modal-container modal-container-active' : 'modal-container'}>
            </div>
            {
                info === 'edit' ? 
                <ModalInfo toggleModal={toggleModal} active={active}/>
                : info === 'project' ? 
                <ModalProject toggleModal={toggleModal} 
                active={active} 
                project={project} 
                update={update} />
                :
                <ModalDelete toggleModal={toggleModal}
                active={active}
                project={project}
                update={update} />
            }
        </div>
    )
}