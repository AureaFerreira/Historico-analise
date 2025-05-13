import React, { useEffect } from 'react';
import JitsiMeetJS from 'lib-jitsi-meet'; // Importando a API Jitsi Meet

const JitsiConference = () => {
  useEffect(() => {
    const domain = 'meet.jit.si'; // Domínio do servidor Jitsi (pode ser personalizado)
    const roomName = 'MinhaSalaDeReunião'; // Nome da sala de conferência

    // Criação da configuração da conferência
    const options = {
      roomName: roomName,
      width: '100%',
      height: 500, // Tamanho da videoconferência
      parentNode: document.querySelector('#jitsi-meet-container'), // Onde a videoconferência será renderizada
      configOverwrite: {
        prejoinPageEnabled: false, // Habilita a conferência sem a página de pré-entrada
        startWithAudioMuted: true, // Começar com áudio desativado
        startWithVideoMuted: false, // Começar com vídeo ativado
      },
    };

    const api = new JitsiMeetJS.JitsiMeetExternalAPI(domain, options);

    // Inicia a conferência
    api.executeCommand('displayName', 'Meu Nome'); // Altera o nome exibido
    api.executeCommand('subject', 'Reunião de Teste'); // Definir o título da reunião

    return () => {
      // Limpeza quando o componente for desmontado
      api.dispose();
    };
  }, []);

  return (
    <div id="jitsi-meet-container" style={{ height: '100%' }}></div>
  );
};

export default JitsiConference;
