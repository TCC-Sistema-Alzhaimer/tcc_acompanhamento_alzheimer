import { StyleSheet, TouchableOpacity, View } from "react-native";
import { IconSymbol, IconSymbolName } from "../ui/IconSymbol";

interface CardIconProps {
  name: IconSymbolName;
  onPress?: () => void;
}

export function CardIcon({ name, onPress }: CardIconProps) {
  const handlePress = () => {
    console.log(`Icon ${name} pressed`);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.subContainer}>
        <IconSymbol name={name} size={18} weight="medium" color="#888" />
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  subContainer: {
    backgroundColor: "#f0f0f0",
    height: 32,
    width: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
