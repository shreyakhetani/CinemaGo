import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView, TextInput } from 'react-native';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

type SelectedSeat = { row: number; col: number };

export default function PaymentScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const selectedSeats: SelectedSeat[] = params.selectedSeats ? JSON.parse(params.selectedSeats as string) : [];
    const [name, setName] = useState('');
    const { confirmPayment, loading } = useConfirmPayment();

    // Simulate fetching a payment intent client secret
    const fetchPaymentIntentClientSecret = async () => {
        // Simulate a delay like a network request
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Return a mock client secret
        return 'mock_client_secret';
    };

    const handlePayPress = async () => {
        try {
            const clientSecret = await fetchPaymentIntentClientSecret();
            const billingDetails = { name };
            // Simulate a successful payment confirmation without actual Stripe confirmation
            console.log("Payment success:", clientSecret);
            Alert.alert('Payment Successful', 'Your payment was processed successfully.');
            router.push({
                pathname: '/(tabs)/TicketConfirmation',
                params: { selectedSeats: JSON.stringify(selectedSeats) },
            });
        } catch (err) {
            console.error("Payment error:", err);
            Alert.alert('Payment Processing Error', 'Failed to process the payment.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Payment Details</Text>
            {selectedSeats.map((seat, index) => (
                <Text key={index} style={styles.text}>
                    Row {seat.row + 1}, Col {seat.col + 1}
                </Text>
            ))}

            <TextInput
                autoCapitalize="none"
                placeholder="Name"
                keyboardType="name-phone-pad"
                onChangeText={setName}
                style={styles.input}
            />
            <CardField
                onCardChange={cardDetails => {
                    console.log('cardDetails', cardDetails);
                }}
                onFocus={focusedField => {
                    console.log('focusField', focusedField);
                }}
                style={styles.cardField}
            />
            <Button onPress={handlePayPress} title="Pay" disabled={loading} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    cardField: {
        width: '100%',
        height: 50,
        marginVertical: 30,
    },
});
