// Performance test for feature extraction
import { getAllFeatures, buildFeatureDictionary } from './featureExtractor';
import { precomputeListingFeatures } from './featureMatcher';

export function testFeatureExtractionPerformance() {
  console.time('Feature Dictionary Build');
  const dictionary = buildFeatureDictionary();
  console.timeEnd('Feature Dictionary Build');
  
  console.time('All Features Get');
  const allFeatures = getAllFeatures();
  console.timeEnd('All Features Get');
  
  console.log(`Dictionary has ${Object.keys(dictionary).length} features`);
  console.log(`All features array has ${allFeatures.length} items`);
  
  return { dictionary, allFeatures };
}

export function testFeatureMatchingPerformance(listing) {
  console.time('Precompute Features');
  const features = precomputeListingFeatures(listing);
  console.timeEnd('Precompute Features');
  
  console.log(`Listing has ${features.length} matching features:`, features);
  
  return features;
} 