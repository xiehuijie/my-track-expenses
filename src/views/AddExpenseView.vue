<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useExpenseStore } from '@/stores/expense';
import { useI18n } from 'vue-i18n';
import SubPageLayout from '@/layouts/SubPageLayout.vue';

const { t } = useI18n();
const router = useRouter();
const expenseStore = useExpenseStore();

const form = ref<InstanceType<typeof import('vuetify/components').VForm> | null>(null);
const amount = ref<number | null>(null);
const description = ref('');
const category = ref('');
const date = ref(new Date().toISOString().split('T')[0]);

const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Other'];

const rules = {
    required: (v: string | number | null) => !!v || v === 0 || 'This field is required',
    positiveNumber: (v: number | null) => (v !== null && v > 0) || 'Amount must be positive',
};

const submitForm = async () => {
    if (!form.value) return;
    const { valid } = await form.value.validate();
    if (valid && amount.value !== null) {
        await expenseStore.addExpense({
            amount: amount.value,
            description: description.value,
            category: category.value,
            date: date.value,
        });
        router.push('/');
    }
};
</script>

<template>
    <SubPageLayout :title="t('expense.addExpense', 'Add Expense')">
        <v-container class="py-4">
            <v-card elevation="4">
                <v-card-text class="pa-6">
                    <v-form ref="form" @submit.prevent="submitForm">
                        <v-text-field
                            v-model.number="amount"
                            :label="t('expense.amount')"
                            type="number"
                            prefix="$"
                            :rules="[rules.required, rules.positiveNumber]"
                            variant="outlined"
                            class="mb-4"
                        />

                        <v-text-field v-model="description" :label="t('expense.description')" :rules="[rules.required]" variant="outlined" class="mb-4" />

                        <v-select
                            v-model="category"
                            :items="categories"
                            :label="t('expense.category')"
                            :rules="[rules.required]"
                            variant="outlined"
                            class="mb-4"
                        />

                        <v-text-field v-model="date" :label="t('expense.date')" type="date" :rules="[rules.required]" variant="outlined" class="mb-4" />

                        <v-btn type="submit" color="primary" variant="elevated" block size="large" class="mt-4">
                            {{ t('expense.save') }}
                        </v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-container>
    </SubPageLayout>
</template>
