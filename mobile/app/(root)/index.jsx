import { styles } from "../../assets/styles/home.styles.js";
import { useUser } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import PageLoader from "../../components/PageLoader";
import { useTransactions } from "../../hooks/useTransactions";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SignOutButton } from "@/components/SignOutButton";

export default function Page() {
  const router = useRouter();
  const { user } = useUser();
  const { transactions, summary, loading, loadData, deleteTransaction } =
    useTransactions(user.id);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) return <PageLoader />;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          {/* Left */}
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>
          {/* Right */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>
      </View>
    </View>
  );
}
