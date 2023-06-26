import React from 'react';

class controlModal {
  constructor() {
    this.props = {};
    this.state = {
      isModalVisible: false,
    };
  }

  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };
}
