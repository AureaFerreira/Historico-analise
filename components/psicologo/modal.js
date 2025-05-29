import React, { useState } from "react";
import { View, Modal, TextInput, TouchableOpacity } from "react-native";
import { Text, Button } from "react-native-paper";

const ChecklistModal = ({ visible, onDismiss, onSave }) => {
    const [checklist, setChecklist] = useState([]);
    const [newItem, setNewItem] = useState("");

    const handleSave = () => {
        if (newItem.trim()) {
            const updatedChecklist = [...checklist, { id: Date.now(), title: newItem, completed: false }];
            setChecklist(updatedChecklist);
            setNewItem("");
            onSave(updatedChecklist);
        }
        onDismiss();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onDismiss}
        >
            <View style={styles.overlay} onClick={onDismiss}>
                <View style={styles.modalContainer}>
                    <Text variant="titleMedium" style={{ fontFamily: 'Poppins-Regular', marginBottom: 5 }}>Adicionar Checklist</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Digite aqui.."
                            value={newItem}
                            onChangeText={setNewItem}
                            style={{ flex: 1, backgroundColor: "transparent", fontFamily: 'Poppins-Light', }}
                        />
                    </View>

                    <TouchableOpacity mode="contained" onPress={handleSave}
                        style={{
                            backgroundColor: "#F37187",
                            borderRadius: 20,
                            padding: 10,
                        }}>
                        <Text  style={{
                           
                            fontFamily: 'Poppins-Light',
                            
                            color: 'white'
                        }}>Salvar</Text>

                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = {
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#F37187",
        borderRadius: 20,
        padding: 10,
        marginBottom: 10,
        width: "100%",
        backgroundColor: "#FFF9F9",
    },
};

export default ChecklistModal;
