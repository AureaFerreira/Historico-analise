import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router'; // ou use o react-router-native se estiver usando react-router
import logoOnTerapia from '../../assets/images/logoOnTerapia.png';
import { Ionicons } from '@expo/vector-icons';

export default function Header({ corFundo, href }) {
    return (
        <View style={[styles.capa, { backgroundColor: corFundo }]}>
            <View style={styles.container}>
                <View style={{flex:1}}>
                    <Link href={href} style={styles.backButton}>
                        <Ionicons name="chevron-back-circle-outline" size={30} color="white" />
                    </Link>
                </View>
                <View style={{flex:12, justifyContent:'center', alignItems:'center'}}>
                    <Image source={logoOnTerapia} style={styles.imagem} />
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    capa: {
        width: '100%',
        height: 100,
        // Aumentei um pouco a altura para garantir melhor alinhamento vertical
        justifyContent: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5, // Esta propriedade é para Android
        // marginBottom: ,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        // marginTop:
    },
    backButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagem: {
        width: 35,
        height: 35,
    },
});
