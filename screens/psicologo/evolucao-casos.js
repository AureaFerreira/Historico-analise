import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  LayoutAnimation,
  UIManager,
  Platform,
  TextInput,
} from 'react-native';
import Svg, { Polyline, Text as SvgText, Circle, Line, G, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../../components/geral/Header';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PADDING = 24;
const EXTRA_RIGHT_PADDING = 20;
const GRAPH_HEIGHT = 220;
const GRAPH_WIDTH = SCREEN_WIDTH * 1.5; // Aumentado para melhor visualização
const PIE_CHART_SIZE = 160;
const PIE_CHART_RADIUS = PIE_CHART_SIZE / 2;

const EMOTION_COLORS = {
  happy: '#F59E0B',
  sad: '#3B82F6',
  fear: '#EC4899',
  angry: '#EF4444',
  surprise: '#10B981',
  neutral: '#9CA3AF',
  disgust: '#8B5CF6',
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

export default function EvolucaoCasos() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [notes, setNotes] = useState('');

  const toggleItem = useCallback((idx) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }, []);

  const fetchAnalysis = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8001/analyze-fixed-video');
      if (!res.ok) throw new Error('Erro na resposta da API');
      const json = await res.json();
      setAnalysis(json);
    } catch (error) {
      alert(`Erro ao buscar dados da API: ${error.message}`);
    } finally {
      setLoading(false);
    } 
  }, []);

  const chartPoints = useMemo(() => {
    if (!analysis?.analysis?.length) return [];
    const data = analysis.analysis;
    const maxSecond = Math.max(...data.map((d) => d.second));

    return data.map((d) => ({
      x: (d.second / maxSecond) * GRAPH_WIDTH,
      y: GRAPH_HEIGHT - ((d.emotions[d.dominant_emotion] ?? 0) * GRAPH_HEIGHT) / 100,
      ...d,
    }));
  }, [analysis]);

  // Calcula a distribuição geral das emoções para o gráfico de pizza
  const pieChartData = useMemo(() => {
    if (!analysis?.analysis?.length) return [];

    const emotionTotals = analysis.analysis.reduce((acc, curr) => {
      Object.entries(curr.emotions).forEach(([emotion, value]) => {
        acc[emotion] = (acc[emotion] || 0) + value;
      });
      return acc;
    }, {});

    const total = Object.values(emotionTotals).reduce((sum, val) => sum + val, 0);

    return Object.entries(emotionTotals)
      .map(([emotion, value]) => ({
        emotion,
        value,
        percentage: (value / total) * 100,
        color: getEmotionColor(emotion),
      }))
      .sort((a, b) => b.value - a.value);
  }, [analysis]);

  // Gera os paths para o gráfico de pizza
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
          <Text style={styles.secondBadge}>{item.second}s</Text>
          <View>
            <Text style={styles.secondLabel}>Segundo {item.second}</Text>
            <Text style={[styles.dominantLabel, { color: getEmotionColor(item.dominant_emotion) }]}>
              {getEmotionTranslation(item.dominant_emotion).toUpperCase()} ({item.emotions[item.dominant_emotion]}%)
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
                <Text style={styles.emotionName}>{getEmotionTranslation(emo)}:</Text> {val}%
              </Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header corFundo="#F43F5E" />

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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.infoBox}>
            <InfoItem icon="videocam" text={analysis.video} />
            <InfoItem icon="description" text={analysis.output_json} />
            <InfoItem
              icon="timer"
              text={`Duração total: ${Math.max(...analysis.analysis.map((d) => d.second))}s`}
            />
          </View>

          {/* Seção do gráfico de pizza com caixa de notas */}
          <View style={styles.pieChartSection}>
            <Text style={styles.sectionHeading}>📊 Distribuição Emocional</Text>
            
            <View style={styles.pieChartRow}>
              <View style={styles.pieChartContainer}>
                <Svg width={PIE_CHART_SIZE} height={PIE_CHART_SIZE}>
                  {pieChartPaths.map((slice, index) => (
                    <Path
                      key={index}
                      d={slice.pathData}
                      fill={slice.color}
                      stroke="#FFF"
                      strokeWidth={2}
                    />
                  ))}
                  
                  <Circle
                    cx={PIE_CHART_RADIUS}
                    cy={PIE_CHART_RADIUS}
                    r={PIE_CHART_RADIUS * 0.5}
                    fill="#FFF"
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
              </View>
              
              <View style={styles.notesContainer}>
                <Text style={styles.notesLabel}>Anotações</Text>
                <TextInput
                  style={styles.notesInput}
                  multiline
                  placeholder="Escreva suas observações sobre a análise..."
                  placeholderTextColor="#9CA3AF"
                  value={notes}
                  onChangeText={setNotes}
                />
              </View>
            </View>
            
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
          </View>

          {/* Gráfico de linha melhorado */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>📈 Tendência da Emoção Dominante</Text>
            <Text style={styles.chartSubtitle}>Segundos analisados: {analysis.analysis.length}</Text>

            <View style={styles.chartContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
              >
                <Svg height={GRAPH_HEIGHT + 80} width={GRAPH_WIDTH}>
                  <Defs>
                    <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <Stop offset="0%" stopColor="#F43F5E" stopOpacity={0.2} />
                      <Stop offset="100%" stopColor="#F43F5E" stopOpacity={0} />
                    </LinearGradient>
                  </Defs>
                  
                  {/* Grid */}
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
                        x={GRAPH_WIDTH + 4}
                        y={GRAPH_HEIGHT - (p * GRAPH_HEIGHT) / 100 + 4}
                        fontSize="12"
                        fill="#9CA3AF"
                      >
                        {p}%
                      </SvgText>
                    </React.Fragment>
                  ))}

                  {/* Eixo X com segundos */}
                  {analysis.analysis
                    .filter((_, i) => i % 5 === 0)
                    .map((d) => {
                      const x = (d.second / Math.max(...analysis.analysis.map((d) => d.second))) * GRAPH_WIDTH;
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

                  {/* Área preenchida abaixo da linha */}
                  <Path
                    d={`M0,${GRAPH_HEIGHT} L${chartPoints.map(pt => `${pt.x},${pt.y}`).join(' L')} L${GRAPH_WIDTH},${GRAPH_HEIGHT} Z`}
                    fill="url(#gradient)"
                  />

                  {/* Linha principal com gradiente */}
                  <Polyline
                    points={chartPoints.map((pt) => `${pt.x},${pt.y}`).join(' ')}
                    fill="none"
                    stroke="#F43F5E"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Pontos interativos */}
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
                            y={pt.y - 15}
                            fontSize="12"
                            fontWeight="bold"
                            fill={getEmotionColor(pt.dominant_emotion)}
                            textAnchor="middle"
                          >
                            {getEmotionTranslation(pt.dominant_emotion)} ({pt.emotions[pt.dominant_emotion]}%)
                          </SvgText>
                        </G>
                      )}
                    </G>
                  ))}
                </Svg>
              </ScrollView>

              {/* Caixa de texto ao lado do gráfico */}
              <View style={styles.chartNotesContainer}>
                <Text style={styles.chartNotesTitle}>Observações do Gráfico</Text>
                <TextInput
                  style={styles.chartNotesInput}
                  multiline
                  placeholder="Anote padrões ou insights sobre a evolução emocional..."
                  placeholderTextColor="#9CA3AF"
                  value={notes}
                  onChangeText={setNotes}
                />
              </View>
            </View>

            {/* Tooltip */}
            {selectedPoint && (
              <View style={styles.tooltip}>
                <Text style={[styles.tooltipEmotion, { color: getEmotionColor(selectedPoint.dominant_emotion) }]}>
                  {getEmotionTranslation(selectedPoint.dominant_emotion).toUpperCase()}
                </Text>
                <Text style={styles.tooltipText}>
                  {selectedPoint.emotions[selectedPoint.dominant_emotion]}% no segundo {selectedPoint.second}
                </Text>
              </View>
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
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </ScrollView>
      )}
    </View>
  );
}

const InfoItem = ({ icon, text }) => (
  <View style={styles.infoItem}>
    <MaterialIcons name={icon} size={18} color="#F43F5E" style={{ marginRight: 6 }} />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const LegendChip = ({ label, color }) => (
  <View style={styles.legendChip}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingHorizontal: H_PADDING },
  titleWrapper: { marginTop: 14, alignItems: 'center', marginBottom: 18 },
  title: { fontSize: 22, fontWeight: '700', color: '#1E293B' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 4 },
  analyzeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F43F5E',
    borderRadius: 10,
    paddingVertical: 14,
    elevation: 2,
  },
  analyzeText: { color: '#FFF', fontSize: 16, fontWeight: '600', marginLeft: 6 },
  scrollContent: { paddingBottom: 40 },
  infoBox: { 
    backgroundColor: '#FFE4E6', 
    borderRadius: 12, 
    padding: 14, 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  infoItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoText: { flex: 1, fontSize: 12, color: '#B91C1C' },
  
  // Estilos para a seção do gráfico de pizza
  pieChartSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 22,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  pieChartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  pieChartContainer: {
    width: PIE_CHART_SIZE,
    height: PIE_CHART_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesContainer: {
    flex: 1,
    marginLeft: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  notesInput: {
    flex: 1,
    minHeight: 120,
    fontSize: 14,
    color: '#1E293B',
    textAlignVertical: 'top',
  },
  pieChartLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  
  // Estilos para o gráfico de linha melhorado
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 22,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  chartContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  chartTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  chartSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  chartNotesContainer: {
    width: 150,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chartNotesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  chartNotesInput: {
    flex: 1,
    fontSize: 12,
    color: '#1E293B',
    textAlignVertical: 'top',
  },
  legendWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 14,
  },
  legendChip: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginHorizontal: 6, 
    marginVertical: 4,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 4 },
  legendLabel: { fontSize: 10, fontWeight: '500', color: '#4B5563' },
  sectionHeading: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#1E293B', 
    marginBottom: 12,
    marginTop: 8,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 6,
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  detailHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  secondBadge: {
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 10,
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  secondLabel: { fontSize: 14, fontWeight: '600', color: '#334155' },
  dominantLabel: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  detailContent: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 12 },
  emotionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  emotionDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  emotionName: { fontWeight: '700', textTransform: 'capitalize' },
  emotionText: { fontSize: 13, color: '#334155' },
  tooltip: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  tooltipEmotion: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tooltipText: {
    fontSize: 14,
    color: '#6B7280',
  },
});