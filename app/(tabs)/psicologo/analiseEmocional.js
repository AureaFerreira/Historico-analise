import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    LayoutAnimation,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Polyline, Stop, Text as SvgText } from 'react-native-svg';
import { useAppContext } from '../../../components/provider'; // Ajusta o caminho se estiver diferente


// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PADDING = 24;
const EXTRA_RIGHT_PADDING = 20;
const GRAPH_HEIGHT = 220;
const GRAPH_WIDTH = SCREEN_WIDTH * 1.5;
const PIE_CHART_SIZE = 160;
const PIE_CHART_RADIUS = PIE_CHART_SIZE / 2;

// Updated EMOTION_COLORS for a softer, more modern palette
const EMOTION_COLORS = {
    happy: '#FFD166', // Softer yellow
    sad: '#6A99EE',  // Softer blue
    fear: '#FF9AA2', // Softer pink
    angry: '#FF6F61',// Softer red
    surprise: '#99E1D9', // Muted teal
    neutral: '#B0C4DE', // Light Slate Gray
    disgust: '#C084FC', // Softer purple
};

const EMOTION_TRANSLATIONS = {
    happy: 'feliz',
    sad: 'triste',
    fear: 'medo',
    angry: 'raiva',
    surprise: 'surpresa',
    neutral: 'neutro',
    disgust: 'desgosto',
};

const getEmotionColor = (emotion) => EMOTION_COLORS[emotion] ?? '#E5E7EB';
const getEmotionTranslation = (emotion) => EMOTION_TRANSLATIONS[emotion] ?? emotion;

export default function AnaliseEmocional() {
    const params = useLocalSearchParams();

    const router = useRouter();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState({});
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [notes, setNotes] = useState('');
    const [chartNotes, setChartNotes] = useState(''); // Separate state for chart notes
    const { enviarAnaliseFacial } = useAppContext();

    const toggleItem = useCallback((idx) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
    }, []);

    const fetchAnalysis = useCallback(async () => {
        setLoading(true);
        try {
            // Log for debugging the initial parameters
            console.log('Parâmetros recebidos na AnaliseEmocional:', params);

            // Ensure idPaciente is a number. Use 1 as a fallback if not provided or invalid.
            const idPaciente = Number(params?.idPaciente);
            if (isNaN(idPaciente)) {
                console.warn("idPaciente é inválido ou ausente. Usando 1 como fallback.");
            }
            const finalIdPaciente = isNaN(idPaciente) ? 1 : idPaciente;
            console.log('ID Paciente sendo enviado para o Supabase (Após conversão):', finalIdPaciente);

            const res = await fetch('http://10.0.2.2:9000/emocional/analyze-fixed-video');
            if (!res.ok) {
                const errorData = await res.text(); // Get raw text for more detail
                throw new Error(`Erro na resposta da API: ${res.status} ${res.statusText}. Detalhes: ${errorData}`);
            }

            const json = await res.json();
            setAnalysis(json);

            // Prepare emotion distribution for Supabase
            const emotionTotals = {};
            json.analysis.forEach((d) => {
                Object.entries(d.emotions).forEach(([emotion, value]) => {
                    emotionTotals[emotion] = (emotionTotals[emotion] || 0) + value;
                });
            });

            const totalEmotion = Object.values(emotionTotals).reduce((sum, val) => sum + val, 0);
            const overallEmotionDist = Object.entries(emotionTotals).map(([emotion, value]) => ({
                emotion,
                value,
                percentage: (value / totalEmotion) * 100,
            }));

            // Save to Supabase
            await enviarAnaliseFacial({
                idPaciente: finalIdPaciente,
                nome_arquivo_video: json.video || 'video_analisado', // Provide a default if missing
                analise_detalhada: json.analysis || [],
                distribuicao_emocoes: overallEmotionDist,
                notas_gerais: notes,
                notas_grafico: chartNotes // Use separate chart notes
            });
            Alert.alert("Sucesso", "Análise e dados salvos com sucesso!");

        } catch (error) {
            console.error("Erro na análise ou salvamento:", error); // Log detailed error
            Alert.alert("Erro", `Erro ao buscar ou salvar dados: ${error.message}. Verifique sua conexão e o servidor.`);
        } finally {
            setLoading(false);
        }
    }, [notes, chartNotes, params, enviarAnaliseFacial]); // Added `enviarAnaliseFacial` as dependency

    const chartPoints = useMemo(() => {
        if (!analysis?.analysis?.length) return [];
        const data = analysis.analysis;
        const maxSecond = Math.max(...data.map((d) => d.second));

        // Ensure scaleFactor is not zero or infinite
        const scaleFactor = maxSecond > 0 ? GRAPH_WIDTH / maxSecond : 0;

        return data.map((d) => ({
            x: d.second * scaleFactor,
            y: GRAPH_HEIGHT - ((d.emotions[d.dominant_emotion] ?? 0) / 100) * GRAPH_HEIGHT,
            ...d,
        }));
    }, [analysis]);

    const pieChartData = useMemo(() => {
        if (!analysis?.analysis?.length) return [];

        const emotionTotals = analysis.analysis.reduce((acc, curr) => {
            Object.entries(curr.emotions).forEach(([emotion, value]) => {
                acc[emotion] = (acc[emotion] || 0) + value;
            });
            return acc;
        }, {});

        const total = Object.values(emotionTotals).reduce((sum, val) => sum + val, 0);

        if (total === 0) return []; // Handle case with no emotion data

        return Object.entries(emotionTotals)
            .filter(([, value]) => value > 0)
            .map(([emotion, value]) => ({
                emotion,
                value,
                percentage: (value / total) * 100,
                color: getEmotionColor(emotion),
            }))
            .sort((a, b) => b.value - a.value);
    }, [analysis]);

    const pieChartPaths = useMemo(() => {
        if (!pieChartData.length) return [];

        let startAngle = 0;
        const paths = [];

        pieChartData.forEach((slice) => {
            const endAngle = startAngle + (slice.percentage / 100) * 2 * Math.PI;

            const x1 = PIE_CHART_RADIUS + PIE_CHART_RADIUS * Math.cos(startAngle);
            const y1 = PIE_CHART_RADIUS + PIE_CHART_RADIUS * Math.sin(startAngle);
            const x2 = PIE_CHART_RADIUS + PIE_CHART_RADIUS * Math.cos(endAngle);
            const y2 = PIE_CHART_RADIUS + PIE_CHART_RADIUS * Math.sin(endAngle);

            const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

            const pathData = [
                `M ${PIE_CHART_RADIUS} ${PIE_CHART_RADIUS}`,
                `L ${x1} ${y1}`,
                `A ${PIE_CHART_RADIUS} ${PIE_CHART_RADIUS} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z',
            ].join(' ');

            paths.push({
                pathData,
                color: slice.color,
                emotion: slice.emotion,
                percentage: slice.percentage,
            });

            startAngle = endAngle;
        });

        return paths;
    }, [pieChartData]);

    const InfoItem = ({ icon, text }) => (
        <View style={styles.infoItem}>
            <MaterialIcons name={icon} size={20} color="#64748B" style={{ marginRight: 8 }} /> {/* Darker icon color */}
            <Text style={styles.infoText}>{text}</Text>
        </View>
    );

    const LegendChip = ({ label, color }) => (
        <View style={styles.legendChip}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendLabel}>{label}</Text>
        </View>
    );

    const renderDetailItem = ({ item, index }) => (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => toggleItem(index)}
            style={[
                styles.detailCard,
                { borderLeftColor: getEmotionColor(item.dominant_emotion) },
            ]}
        >
            <View style={styles.detailHeaderRow}>
                <View style={styles.detailHeaderLeft}>
                    <View style={[styles.secondBadge, { backgroundColor: getEmotionColor(item.dominant_emotion) }]}>
                        <Text style={styles.secondBadgeText}>{item.second}s</Text>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.secondLabel}>Segundo {item.second}</Text>
                        <Text style={[styles.dominantLabel, { color: getEmotionColor(item.dominant_emotion) }]}>
                            {getEmotionTranslation(item.dominant_emotion).toUpperCase()} ({item.emotions[item.dominant_emotion]?.toFixed(1) ?? 'N/A'}%)
                        </Text>
                    </View>
                </View>
                <MaterialIcons
                    name={expanded[index] ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={24}
                    color="#6B7280"
                />
            </View>

            {expanded[index] && (
                <View style={styles.detailContent}>
                    {Object.entries(item.emotions).map(([emo, val]) => (
                        <View key={emo} style={styles.emotionRow}>
                            <View style={[styles.emotionDot, { backgroundColor: getEmotionColor(emo) }]} />
                            <Text style={styles.emotionText}>
                                <Text style={styles.emotionName}>{getEmotionTranslation(emo)}:</Text> {val.toFixed(1)}%
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <Image source={require('@/assets/images/logoOnTerapia.png')} style={styles.logo} resizeMode="contain" />
                    <Text style={styles.headerTitle}>{params?.paciente || 'Análise Emocional'}</Text>
                </View>

                <View style={styles.backButton} /> {/* espaço à direita para balancear */}
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>📊 Evolução Emocional</Text>
                    <Text style={styles.subtitle}>Análise por segundo das emoções detectadas</Text>
                </View>

                <TouchableOpacity
                    style={[styles.analyzeBtn, loading && { opacity: 0.75 }]}
                    disabled={loading}
                    onPress={fetchAnalysis}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            <MaterialIcons name="play-circle-filled" size={20} color="#FFF" />
                            <Text style={styles.analyzeText}>Analisar Vídeo</Text>
                        </>
                    )}
                </TouchableOpacity>

                {analysis && (
                    <>
                        <View style={styles.infoBox}>
                            <InfoItem icon="person" text={`Paciente: ${params?.paciente || 'Não informado'}`} />
                            <InfoItem icon="date-range" text={`Data: ${params?.data || 'Não informada'}`} />
                            <InfoItem icon="videocam" text={`Vídeo: ${analysis.video || 'Não informado'}`} />
                            {analysis.analysis?.length > 0 && (
                                <InfoItem
                                    icon="timer"
                                    text={`Duração total: ${Math.max(...analysis.analysis.map((d) => d.second))}s`}
                                />
                            )}
                        </View>

                        <View style={styles.pieChartSection}>
                            <Text style={styles.sectionHeading}>📊 Distribuição Emocional Geral</Text>

                            <View style={styles.pieChartRow}>
                                <View style={styles.pieChartContainer}>
                                    {pieChartData.length > 0 ? (
                                        <Svg width={PIE_CHART_SIZE} height={PIE_CHART_SIZE}>
                                            <Defs>
                                                <LinearGradient id="totalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <Stop offset="0%" stopColor="#F37187" stopOpacity={0.8} />
                                                    <Stop offset="100%" stopColor="#FFC0CB" stopOpacity={0.8} />
                                                </LinearGradient>
                                            </Defs>
                                            {pieChartPaths.map((slice, index) => (
                                                <Path
                                                    key={index}
                                                    d={slice.pathData}
                                                    fill={slice.color}
                                                    stroke="#F8FAFC" // Match background for a cleaner cut
                                                    strokeWidth={2}
                                                />
                                            ))}

                                            <Circle
                                                cx={PIE_CHART_RADIUS}
                                                cy={PIE_CHART_RADIUS}
                                                r={PIE_CHART_RADIUS * 0.5}
                                                fill="#F8FAFC" // Match container background
                                            />

                                            <SvgText
                                                x={PIE_CHART_RADIUS}
                                                y={PIE_CHART_RADIUS - 10}
                                                fontSize="14"
                                                fontWeight="bold"
                                                fill="#1E293B"
                                                textAnchor="middle"
                                            >
                                                Total
                                            </SvgText>
                                            <SvgText
                                                x={PIE_CHART_RADIUS}
                                                y={PIE_CHART_RADIUS + 15}
                                                fontSize="12"
                                                fill="#64748B"
                                                textAnchor="middle"
                                            >
                                                {analysis.analysis.length}s
                                            </SvgText>
                                        </Svg>
                                    ) : (
                                        <Text style={styles.noDataText}>Sem dados para o gráfico de pizza.</Text>
                                    )}
                                </View>

                                <View style={styles.notesContainer}>
                                    <Text style={styles.notesLabel}>Anotações Gerais</Text>
                                    <TextInput
                                        style={styles.notesInput}
                                        multiline
                                        placeholder="Escreva suas observações gerais sobre a análise do vídeo..."
                                        placeholderTextColor="#9CA3AF"
                                        value={notes}
                                        onChangeText={setNotes}
                                    />
                                </View>
                            </View>

                            {pieChartData.length > 0 && (
                                <View style={styles.pieChartLegend}>
                                    {pieChartData.map((slice) => (
                                        <View key={slice.emotion} style={styles.legendItem}>
                                            <View style={[styles.legendColor, { backgroundColor: slice.color }]} />
                                            <Text style={styles.legendText}>
                                                {getEmotionTranslation(slice.emotion)}: {slice.percentage.toFixed(1)}%
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>

                        <View style={styles.chartCard}>
                            <Text style={styles.chartTitle}>📈 Tendência da Emoção Dominante</Text>
                            <Text style={styles.chartSubtitle}>Segundos analisados: {analysis.analysis.length}</Text>

                            {chartPoints.length > 0 ? (
                                <View style={styles.chartWrapper}> {/* New wrapper for chart and its notes */}
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ paddingRight: EXTRA_RIGHT_PADDING }}
                                    >
                                        <Svg height={GRAPH_HEIGHT + 80} width={GRAPH_WIDTH + EXTRA_RIGHT_PADDING}>
                                            <Defs>
                                                <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <Stop offset="0%" stopColor="#F37187" stopOpacity={0.2} />
                                                    <Stop offset="100%" stopColor="#F37187" stopOpacity={0} />
                                                </LinearGradient>
                                            </Defs>

                                            {[0, 25, 50, 75, 100].map((p) => (
                                                <React.Fragment key={p}>
                                                    <Line
                                                        x1={0}
                                                        y1={GRAPH_HEIGHT - (p * GRAPH_HEIGHT) / 100}
                                                        x2={GRAPH_WIDTH}
                                                        y2={GRAPH_HEIGHT - (p * GRAPH_HEIGHT) / 100}
                                                        stroke="#E5E7EB"
                                                        strokeWidth={1}
                                                        strokeDasharray={p !== 0 && p !== 100 ? '4,4' : '0'}
                                                    />
                                                    <SvgText
                                                        x={-H_PADDING + 8}
                                                        y={GRAPH_HEIGHT - (p * GRAPH_HEIGHT) / 100 + 4}
                                                        fontSize="12"
                                                        fill="#9CA3AF"
                                                        textAnchor="start"
                                                    >
                                                        {p}%
                                                    </SvgText>
                                                </React.Fragment>
                                            ))}

                                            {analysis.analysis
                                                .filter((_, i) => i % 5 === 0 || i === analysis.analysis.length - 1)
                                                .map((d) => {
                                                    const maxSecond = Math.max(...analysis.analysis.map((dataPoint) => dataPoint.second));
                                                    // Ensure maxSecond is not zero to avoid division by zero
                                                    const x = maxSecond > 0 ? (d.second / maxSecond) * GRAPH_WIDTH : 0;
                                                    return (
                                                        <G key={`time-${d.second}`}>
                                                            <Line
                                                                x1={x}
                                                                y1={GRAPH_HEIGHT}
                                                                x2={x}
                                                                y2={GRAPH_HEIGHT + 5}
                                                                stroke="#6B7280"
                                                                strokeWidth={1}
                                                            />
                                                            <SvgText
                                                                x={x}
                                                                y={GRAPH_HEIGHT + 25}
                                                                fontSize="12"
                                                                fill="#374151"
                                                                textAnchor="middle"
                                                            >
                                                                {d.second}s
                                                            </SvgText>
                                                        </G>
                                                    );
                                                })}

                                            <Path
                                                d={`M0,${GRAPH_HEIGHT} L${chartPoints.map(pt => `${pt.x},${pt.y}`).join(' L')} L${GRAPH_WIDTH},${GRAPH_HEIGHT} Z`}
                                                fill="url(#gradient)"
                                            />

                                            <Polyline
                                                points={chartPoints.map((pt) => `${pt.x},${pt.y}`).join(' ')}
                                                fill="none"
                                                stroke="#F37187" // Consistent with header pink
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />

                                            {chartPoints.map((pt, i) => (
                                                <G key={i}>
                                                    <Circle
                                                        cx={pt.x}
                                                        cy={pt.y}
                                                        r="6"
                                                        fill={getEmotionColor(pt.dominant_emotion)}
                                                        stroke="#FFF"
                                                        strokeWidth="2"
                                                        onPress={() => setSelectedPoint(selectedPoint?.second === pt.second ? null : pt)}
                                                    />
                                                    {selectedPoint?.second === pt.second && (
                                                        <G>
                                                            <Circle
                                                                cx={pt.x}
                                                                cy={pt.y}
                                                                r={12}
                                                                fill={getEmotionColor(pt.dominant_emotion)}
                                                                fillOpacity={0.2}
                                                            />
                                                            <SvgText
                                                                x={pt.x}
                                                                y={pt.y - 25}
                                                                fontSize="12"
                                                                fontWeight="bold"
                                                                fill={getEmotionColor(pt.dominant_emotion)}
                                                                textAnchor="middle"
                                                            >
                                                                {getEmotionTranslation(pt.dominant_emotion)}
                                                            </SvgText>
                                                            <SvgText
                                                                x={pt.x}
                                                                y={pt.y - 10}
                                                                fontSize="11"
                                                                fill="#6B7280"
                                                                textAnchor="middle"
                                                            >
                                                                ({(pt.emotions[pt.dominant_emotion] ?? 0).toFixed(1)}% @ {pt.second}s)
                                                            </SvgText>
                                                        </G>
                                                    )}
                                                </G>
                                            ))}
                                        </Svg>
                                    </ScrollView>

                                    <View style={styles.chartNotesContainer}>
                                        <Text style={styles.chartNotesTitle}>Observações do Gráfico</Text>
                                        <TextInput
                                            style={styles.chartNotesInput}
                                            multiline
                                            placeholder="Anote padrões ou insights sobre a evolução emocional..."
                                            placeholderTextColor="#9CA3AF"
                                            value={chartNotes} // Bind to chartNotes state
                                            onChangeText={setChartNotes} // Update chartNotes state
                                        />
                                    </View>
                                </View>
                            ) : (
                                <Text style={styles.noDataText}>Análise do gráfico de tendência não disponível.</Text>
                            )}

                            <View style={styles.legendWrapper}>
                                {Object.keys(EMOTION_COLORS).map((emo) => (
                                    <LegendChip
                                        key={emo}
                                        label={getEmotionTranslation(emo).toUpperCase()}
                                        color={getEmotionColor(emo)}
                                    />
                                ))}
                            </View>
                        </View>

                        <Text style={styles.sectionHeading}>
                            🧠 Detalhes por Segundo ({analysis.analysis.length} segundos analisados)
                        </Text>
                        <FlatList
                            data={analysis.analysis}
                            keyExtractor={(_, idx) => idx.toString()}
                            renderItem={renderDetailItem}
                            scrollEnabled={false} // Important for FlatList inside ScrollView
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={() => (
                                <Text style={styles.noDataText}>Nenhum detalhe de análise por segundo disponível.</Text>
                            )}
                        />
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC', // Lighter background
    },
    header: {
        backgroundColor: '#F37187', // Original header pink
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50, // More padding for notch/status bar
        paddingBottom: 16,
    },
    backButton: {
        width: 40,
        alignItems: 'center',
    },
    headerCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center content
    },
    logo: {
        width: 30, // Adjust size as needed
        height: 30, // Adjust size as needed
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 18, // Slightly smaller
        fontWeight: '600',
        color: 'white',
        fontFamily: 'Poppins-Regular',
        textAlign: 'center', // Ensure text is centered
    },
    titleWrapper: {
        marginTop: 14,
        alignItems: 'center',
        marginBottom: 18,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 24, // Slightly larger
        fontWeight: '700',
        color: '#1E293B',
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15, // Slightly larger
        color: '#64748B',
        marginTop: 4,
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
    },
    analyzeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F37187',
        borderRadius: 12, // More rounded
        paddingVertical: 16, // More padding
        elevation: 4, // Stronger shadow
        shadowColor: '#F37187', // Pink shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        marginBottom: 24, // More space
        marginHorizontal: 24,
    },
    analyzeText: {
        color: '#FFF',
        fontSize: 18, // Larger text
        fontWeight: '700', // Bolder
        marginLeft: 8, // More space
    },
    scrollContent: {
        paddingBottom: 40,
        paddingHorizontal: H_PADDING, // Use H_PADDING for consistency
    },
    infoBox: {
        backgroundColor: '#FFF5F7', // Very light pink
        borderRadius: 16, // More rounded
        padding: 18, // More padding
        marginBottom: 24,
        shadowColor: '#000',
        shadowOpacity: 0.08, // Subtle shadow
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8, // More space between items
    },
    infoText: {
        flex: 1,
        fontSize: 14, // Slightly larger
        color: '#4B5563', // Darker text
        fontFamily: 'Poppins-Regular',
    },
    pieChartSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20, // More padding
        marginBottom: 24,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    pieChartRow: {
        flexDirection: 'column', // Changed to column for better responsiveness on small screens
        alignItems: 'center', // Center content in column layout
        marginTop: 16,
    },
    pieChartContainer: {
        width: PIE_CHART_SIZE,
        height: PIE_CHART_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20, // Add margin when in column layout
    },
    notesContainer: {
        width: '100%', // Take full width in column layout
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    notesLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 10,
    },
    notesInput: {
        flex: 1,
        minHeight: 100, // Reduced minHeight for better fit
        fontSize: 14,
        color: '#1E293B',
        textAlignVertical: 'top',
        lineHeight: 20, // Improve readability
    },
    pieChartLegend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 20, // More space
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10, // Increased margin
        marginVertical: 6,
        backgroundColor: '#EEF2F6', // Lighter background for chips
        borderRadius: 20, // More rounded
        paddingHorizontal: 12, // More padding
        paddingVertical: 8,
    },
    legendColor: {
        width: 14, // Slightly larger dot
        height: 14,
        borderRadius: 7,
        marginRight: 8,
    },
    legendText: {
        fontSize: 13, // Slightly larger
        fontWeight: '500',
        color: '#4B5563',
    },
    chartCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    chartWrapper: {
        flexDirection: 'row', // Keep chart and notes side by side
        marginTop: 16,
    },
    chartContainer: { // Renamed from chartContainer for clarity (it's the SVG wrapper)
        flex: 1, // Allow SVG to take available space
        // No explicit width needed here if ScrollView handles it
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    chartSubtitle: {
        fontSize: 13,
        color: '#64748B',
    },
    chartNotesContainer: {
        width: 150, // Fixed width for notes beside chart
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        marginLeft: 16, // Space from chart
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    chartNotesTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 10,
    },
    chartNotesInput: {
        flex: 1,
        minHeight: 120, // Adjusted height
        fontSize: 13,
        color: '#1E293B',
        textAlignVertical: 'top',
        lineHeight: 18,
    },
    legendWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 20,
    },
    sectionHeading: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 16,
        marginTop: 8, // Space above heading
        textAlign: 'center', // Center heading
    },
    detailCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderLeftWidth: 6, // Thicker left border for dominant emotion color
        paddingVertical: 14,
        paddingHorizontal: 18,
        marginBottom: 12, // Space between cards
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    detailHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    secondBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        backgroundColor: '#EBF4F5', // Default light background
    },
    secondBadgeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    secondLabel: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    dominantLabel: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 2,
    },
    detailContent: {
        marginTop: 12,
        paddingLeft: 4, // Align with the left border
    },
    emotionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    emotionDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    emotionText: {
        fontSize: 13,
        color: '#4B5563',
    },
    emotionName: {
        fontWeight: '600',
    },
    noDataText: {
        textAlign: 'center',
        color: '#64748B',
        fontSize: 15,
        marginTop: 20,
        fontStyle: 'italic',
    },
});