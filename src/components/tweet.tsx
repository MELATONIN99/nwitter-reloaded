import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, setDoc, } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import Modal from 'react-modal';
import { useState } from "react";
import EditTweetForm from "./edit-tweet-form";


Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
background-color: tomato;
color: white;
font-weight: 600;
border: 0;
font-size: 12px;
padding:5px 10px;
text-transform: uppercase;
border-radius: 5px;
cursor: pointer;
`;




export default function Tweet({username, photo, tweet, userId, id, createAt}:ITweet) {
    const user = auth.currentUser;
    console.log("tweet:::::::", tweet )
    const onDelete = async() => {
        const ok = confirm("Are you sure you want to delete this tweet?")
        if(!ok || user?.uid !== userId) return;
        try {
            await deleteDoc(doc(db,"tweets", id));
            if(photo){
                const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
                await deleteObject(photoRef);
            }
        }catch(e){
            console.log(e);
        } finally {
            //
        }
    };


    function EditModal() {
      const [modalIsOpen, setModalIsOpen] = useState(false);
    
      const openModal = () => {
        setModalIsOpen(true);
      };
    
      const closeModal = () => {
        setModalIsOpen(false);
      };
      
    
        return (
        <div>
          <button onClick={openModal}>Edit</button>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles} // 스타일을 적용합니다. (선택적)
            contentLabel="Edit Modal"
          >
            <EditTweetForm 
            createAt={createAt}
            username = {username} 
            photo = {photo}
            data ={tweet}
            userId = {userId}
             id = {id}></EditTweetForm>
            <button onClick={closeModal}>Close</button>
          </Modal>
        </div>
      );
    }


    return <Wrapper>
        <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        {user?.uid === userId ? <EditModal></EditModal> : null}
        {user?.uid === userId ? <DeleteButton onClick={onDelete}>Delete</DeleteButton> : null}
        </Column>
        <Column>
      {photo ? (
        <Photo src={photo} />
      ) : null }
    </Column>
    
    </Wrapper>
}