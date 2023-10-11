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
    width: '50%',
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
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
border: 2px solid tomato;
height: 30px;
width: 40px;
border-radius: 20%;
background: none;
color: tomato;
`;

const EditButton = styled.button`
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
border: 2px solid white;
height: 30px;
width: 40px;
border-radius: 20%;
background: none;
color: white;
`;


const BackButton = styled.button`
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
border: 2px solid black;
height: 30px;
width: 40px;
border-radius: 20%;
background: white;
color: black;
margin-top: 10px;
`;



export default function Tweet({username, photo, tweet, userId, id, createAt}:ITweet) {
    const user = auth.currentUser;
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
          <EditButton onClick={openModal}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
  <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
</svg>
</EditButton>
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
            tweet ={tweet}
            userId = {userId}
             id = {id}></EditTweetForm>
            <BackButton onClick={closeModal}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
  <path fillRule="evenodd" d="M9.53 2.47a.75.75 0 010 1.06L4.81 8.25H15a6.75 6.75 0 010 13.5h-3a.75.75 0 010-1.5h3a5.25 5.25 0 100-10.5H4.81l4.72 4.72a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z" clipRule="evenodd" />
</svg>
</BackButton>
          </Modal>
        </div>
      );
    }


    return <Wrapper>
        <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        {user?.uid === userId ? <EditModal></EditModal> : null}
        {user?.uid === userId ? <DeleteButton onClick={onDelete}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
  <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
</svg>
</DeleteButton> : null}
        </Column>
        <Column>
      {photo ? (
        <Photo src={photo} />
      ) : null }
    </Column>
    
    </Wrapper>
}