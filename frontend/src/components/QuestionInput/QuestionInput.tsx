
import { useContext, useState, useEffect } from 'react';
import { FontIcon, Stack, TextField } from '@fluentui/react';
import { SendRegular } from '@fluentui/react-icons';
import Send from '../../assets/Send.svg';
import styles from './QuestionInput.module.css';
import { ChatMessage } from '../../api';
import { AppStateContext } from '../../state/AppProvider';
import { resizeImage } from '../../utils/resizeImage';

interface Props {
  onSend: (question: ChatMessage['content'], id?: string) => void;
  disabled?: boolean;
  placeholder?: string;
  clearOnSend?: boolean;
  conversationId?: string;
  value: string;
  setValue: (input: string) => void;
}

const QuestionInput: React.FC<Props> = ({
  onSend,
  disabled = false,
  placeholder = '',
  clearOnSend = false,
  conversationId,
  value,
  setValue,
}) => {
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const appStateContext = useContext(AppStateContext);
  const OYD_ENABLED = appStateContext?.state.frontendSettings?.oyd_enabled ?? false;

  useEffect(() => {
    const handler = (customEvent: CustomEvent<string>) => {
      setValue(customEvent.detail);
    };
    window.addEventListener("SuggestedPromptSelected", handler as EventListener);
    return () => {
      window.removeEventListener("SuggestedPromptSelected", handler as EventListener);
    };
  }, [setValue]);

  const sendQuestion = () => {
    if (disabled || !value.trim()) return;

    const questionContent: ChatMessage["content"] = base64Image
      ? [{ type: "text", text: value }, { type: "image_url", image_url: { url: base64Image } }]
      : value;

    onSend(questionContent, conversationId);
    setBase64Image(null);
    if (clearOnSend) setValue('');
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !(e.nativeEvent as any)?.isComposing) {
      e.preventDefault();
      sendQuestion();
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resizedBase64 = await resizeImage(file, 800, 800);
        setBase64Image(resizedBase64);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <Stack horizontal className={styles.questionInputContainer}>
      <TextField
        className={styles.questionInputTextArea}
        placeholder={placeholder}
        multiline
        resizable={false}
        borderless
        value={value}
        onChange={(e, newValue) => setValue(newValue ?? '')}
        disabled={disabled}
        onKeyDown={onKeyDown}
      />
      {!OYD_ENABLED && (
        <div className={styles.fileInputContainer}>
          <input
            type="file"
            id="fileInput"
            onChange={handleImageUpload}
            accept="image/*"
            className={styles.fileInput}
          />
          <label htmlFor="fileInput" className={styles.fileLabel} aria-label='Upload Image'>
            <FontIcon className={styles.fileIcon} iconName={'PhotoCollection'} aria-label='Upload Image' />
          </label>
        </div>
      )}
      {base64Image && <img className={styles.uploadedImage} src={base64Image} alt="Uploaded Preview" />}
      <div
        className={styles.questionInputSendButtonContainer}
        role="button"
        tabIndex={0}
        aria-label="Ask question button"
        onClick={sendQuestion}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ' ? sendQuestion() : null)}
      >
        {disabled || !value.trim() ? (
          <SendRegular className={styles.questionInputSendButtonDisabled} />
        ) : (
          <img src={Send} className={styles.questionInputSendButton} alt="Send Button" />
        )}
      </div>
      <div className={styles.questionInputBottomBorder} />
    </Stack>
  );
};

export default QuestionInput;
