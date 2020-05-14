import React from 'react';
import styled from '@emotion/styled';
import { ReactTypeformEmbed } from 'react-typeform-embed';

const ChatWidget = () => {

  return (
    <>
      <ReactTypeformEmbed
        popup={false}
        url="https://ecomloop.typeform.com/to/e7T54e"
        buttonText="Start!"
        style={{ top: 90 }}
      />
    </>
  );
}

export default ChatWidget;
