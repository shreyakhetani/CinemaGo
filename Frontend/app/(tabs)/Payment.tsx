import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';

export default function PaymentScreen() {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    const totalAmount = 45.99; // Example total amount

    const handleCardPayment = () => {
        if (!cardNumber || !expiryDate || !cvv) {
            Alert.alert('Error', 'Please fill in all card details.');
            return;
        }
        Alert.alert('Payment Successful', `Your payment of €${totalAmount} has been processed via Credit Card.`);
    };

    const handlePayPalPayment = () => {
        // Simulate PayPal redirect
        Alert.alert('PayPal Payment', `You will be redirected to PayPal to complete your payment of €${totalAmount}.`);
        // Here you would normally redirect the user to PayPal's payment gateway
    };

    const handlePayment = () => {
        if (paymentMethod === 'Credit Card') {
            handleCardPayment();
        } else if (paymentMethod === 'PayPal') {
            handlePayPalPayment();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Payment Details</Text>

            {/* Order Summary */}
            <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>Order Summary</Text>
                <Text style={styles.text}>Ticket(s): 3</Text>
                <Text style={styles.text}>Total Amount: €{totalAmount}</Text>
            </View>

            {/* Payment Method Selection */}
            <View style={styles.paymentMethodContainer}>
                <Text style={styles.paymentMethodTitle}>Choose Payment Method</Text>

                {/* Credit Card Option */}
                <TouchableOpacity
                    style={[
                        styles.paymentOption,
                        paymentMethod === 'Credit Card' && styles.selectedOption,
                    ]}
                    onPress={() => setPaymentMethod('Credit Card')}
                >
                    <Text
                        style={[
                            styles.paymentOptionText,
                            paymentMethod === 'Credit Card' ? styles.selectedText : styles.deselectedText,
                        ]}
                    >
                        Credit Card
                    </Text>
                </TouchableOpacity>

                {/* PayPal Option */}
                <TouchableOpacity
                    style={[
                        styles.paymentOption,
                        paymentMethod === 'PayPal' && styles.selectedOption,
                    ]}
                    onPress={() => setPaymentMethod('PayPal')}
                >
                    <Text
                        style={[
                            styles.paymentOptionText,
                            paymentMethod === 'PayPal' ? styles.selectedText : styles.deselectedText,
                        ]}
                    >
                        PayPal
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Payment Form */}
            {paymentMethod === 'Credit Card' && (
                <View style={styles.paymentForm}>
                    <TextInput
                        style={styles.input}
                        placeholder="Card Number"
                        keyboardType="number-pad"
                        maxLength={16}
                        value={cardNumber}
                        onChangeText={setCardNumber}
                    />
                    <View style={styles.row}>
                        <TextInput
                            style={[styles.input, styles.smallInput]}
                            placeholder="MM/YY"
                            keyboardType="number-pad"
                            maxLength={5}
                            value={expiryDate}
                            onChangeText={setExpiryDate}
                        />
                        <TextInput
                            style={[styles.input, styles.smallInput]}
                            placeholder="CVV"
                            keyboardType="number-pad"
                            maxLength={3}
                            secureTextEntry={true}
                            value={cvv}
                            onChangeText={setCvv}
                        />
                    </View>
                </View>
            )}

            {/* PayPal Info */}
            {paymentMethod === 'PayPal' && (
                <View style={styles.paypalInfo}>
                    <Text style={styles.text}>You will be redirected to PayPal to complete your payment.</Text>
                </View>
            )}

            {/* Proceed to Payment Button */}
            <Button title="Pay Now" onPress={handlePayment} color="#1b293a" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    summaryContainer: {
        marginBottom: 20,
        width: '100%',
    },
    summaryText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
    },
    paymentMethodContainer: {
        width: '100%',
        marginBottom: 20,
    },
    paymentMethodTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    paymentOption: {
        padding: 15,
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    selectedOption: {
        backgroundColor: '#1b293a',
    },
    paymentOptionText: {
        fontSize: 16,
    },
    selectedText: {
        color: '#fff',
    },
    deselectedText: {
        color: '#000',
    },
    paymentForm: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderColor: '#1b293a',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '100%',
    },
    smallInput: {
        flex: 1,
        marginHorizontal: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    paypalInfo: {
        marginBottom: 20,
    },
});
