import { View, StyleSheet, Text, ActivityIndicator, ScrollView } from 'react-native';
import { ReactNode } from 'react';
import { Box } from "@/components/ui/box"

type Props = {
    headerText?: string;
    style?: object;
    children: ReactNode;
};

export default function CardLayout({ children, headerText, style }: Props) {
  return (
    <Box style={style || styles.chartContainer}>
      {headerText && <Text style={styles.chartHeaderText}>{headerText}</Text>}
      {children}
    </Box>
  )
}

const styles = StyleSheet.create({
  chartContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#646466',
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ffffff',
    marginBottom: 8,
  },
  chartHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingBottom: 8,
  },
});
