<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

function goBack() {
  router.back();
}
</script>

<template>
  <div class="page-container">
    <v-app-bar>
      <v-btn
        icon="mdi-arrow-left"
        @click="goBack"
      />
      <v-app-bar-title>{{ t('me.license.title') }}</v-app-bar-title>
    </v-app-bar>
    <v-main>
      <v-container class="py-4">
        <v-card>
          <v-card-title class="text-h6">Apache License 2.0</v-card-title>
          <v-card-text>
            <p class="text-body-2 mb-4">
              Licensed under the Apache License, Version 2.0 (the "License");
              you may not use this file except in compliance with the License.
              You may obtain a copy of the License at
            </p>
            <p class="text-body-2 mb-4">
              <a
                href="http://www.apache.org/licenses/LICENSE-2.0"
                target="_blank"
                rel="noopener noreferrer"
              >
                http://www.apache.org/licenses/LICENSE-2.0
              </a>
            </p>
            <p class="text-body-2">
              Unless required by applicable law or agreed to in writing, software
              distributed under the License is distributed on an "AS IS" BASIS,
              WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
              See the License for the specific language governing permissions and
              limitations under the License.
            </p>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </div>
</template>

<style scoped>
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
