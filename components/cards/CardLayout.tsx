import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ReactNode } from 'react';
import { Box } from "@/components/ui/box"

type Props = {
    headerText?: string;
    style?: object;
    onClick?: () => void;
    children: ReactNode;
};

export default function CardLayout({ children, headerText, style, onClick }: Props) {
  return (
    <TouchableOpacity onPress={onClick} disabled={!onClick}>
      <Box style={style || styles.chartContainer}>
        {headerText && <Text style={styles.chartHeaderText}>{headerText}</Text>}
        {children}
      </Box>
    </TouchableOpacity>
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
