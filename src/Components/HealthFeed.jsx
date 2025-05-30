import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const HealthFeed = () => {
  return (
    <SafeAreaView>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
    </SafeAreaView>
  )
}

export default HealthFeed

const styles = StyleSheet.create({})