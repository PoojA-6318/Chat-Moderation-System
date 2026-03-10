---
tags:
- sentence-transformers
- sentence-similarity
- feature-extraction
- dense
- generated_from_trainer
- dataset_size:942023
- loss:CosineSimilarityLoss
base_model: sentence-transformers/all-MiniLM-L6-v2
widget:
- source_sentence: A man hanging by a cable from the tower.
  sentences:
  - A woman is indoors.
  - The tower is underwater.
  - Heading south from Ribeira Brava will give some of the best views on the island.
- source_sentence: i would hope so i mean you've been together a little bit longer
    than we have
  sentences:
  - I don't care about the gas conpanies or anything regarding them.
  - the two of you have been dating longer than we have
  - Man is drinking beer and throwing frisbee
- source_sentence: Young injured veterans in wheelchair and their able bodied mates.
  sentences:
  - The erotic sculptures were not originally intended for satire, but has turned
    to such.
  - the kid watches the bird on tuesday
  - Men running a triathalon.
- source_sentence: Mechanisms to facilitate the training of good researchers, particularly
    ones from emergency medicine, are needed and should be encouraged.
  sentences:
  - A bird is pecking out the eyes of the man and woman.
  - The Director of Research encouraged them to find new training methods.
  - The only thing in the yard was an ugly pine tree.
- source_sentence: A boy with a brown shirt is holding onto a person with a white
    shirt around a spray of water.
  sentences:
  - The father and daughter are together outside
  - Congress was fully aware of exactly what language survive the defeat.
  - The both have no clothes on.
pipeline_tag: sentence-similarity
library_name: sentence-transformers
---

# SentenceTransformer based on sentence-transformers/all-MiniLM-L6-v2

This is a [sentence-transformers](https://www.SBERT.net) model finetuned from [sentence-transformers/all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2). It maps sentences & paragraphs to a 384-dimensional dense vector space and can be used for semantic textual similarity, semantic search, paraphrase mining, text classification, clustering, and more.

## Model Details

### Model Description
- **Model Type:** Sentence Transformer
- **Base model:** [sentence-transformers/all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) <!-- at revision c9745ed1d9f207416be6d2e6f8de32d1f16199bf -->
- **Maximum Sequence Length:** 256 tokens
- **Output Dimensionality:** 384 dimensions
- **Similarity Function:** Cosine Similarity
<!-- - **Training Dataset:** Unknown -->
<!-- - **Language:** Unknown -->
<!-- - **License:** Unknown -->

### Model Sources

- **Documentation:** [Sentence Transformers Documentation](https://sbert.net)
- **Repository:** [Sentence Transformers on GitHub](https://github.com/huggingface/sentence-transformers)
- **Hugging Face:** [Sentence Transformers on Hugging Face](https://huggingface.co/models?library=sentence-transformers)

### Full Model Architecture

```
SentenceTransformer(
  (0): Transformer({'max_seq_length': 256, 'do_lower_case': False, 'architecture': 'BertModel'})
  (1): Pooling({'word_embedding_dimension': 384, 'pooling_mode_cls_token': False, 'pooling_mode_mean_tokens': True, 'pooling_mode_max_tokens': False, 'pooling_mode_mean_sqrt_len_tokens': False, 'pooling_mode_weightedmean_tokens': False, 'pooling_mode_lasttoken': False, 'include_prompt': True})
  (2): Normalize()
)
```

## Usage

### Direct Usage (Sentence Transformers)

First install the Sentence Transformers library:

```bash
pip install -U sentence-transformers
```

Then you can load this model and run inference.
```python
from sentence_transformers import SentenceTransformer

# Download from the 🤗 Hub
model = SentenceTransformer("sentence_transformers_model_id")
# Run inference
sentences = [
    'A boy with a brown shirt is holding onto a person with a white shirt around a spray of water.',
    'The both have no clothes on.',
    'Congress was fully aware of exactly what language survive the defeat.',
]
embeddings = model.encode(sentences)
print(embeddings.shape)
# [3, 384]

# Get the similarity scores for the embeddings
similarities = model.similarity(embeddings, embeddings)
print(similarities)
# tensor([[ 1.0000, -0.0310,  0.0960],
#         [-0.0310,  1.0000,  0.1765],
#         [ 0.0960,  0.1765,  1.0000]])
```

<!--
### Direct Usage (Transformers)

<details><summary>Click to see the direct usage in Transformers</summary>

</details>
-->

<!--
### Downstream Usage (Sentence Transformers)

You can finetune this model on your own dataset.

<details><summary>Click to expand</summary>

</details>
-->

<!--
### Out-of-Scope Use

*List how the model may foreseeably be misused and address what users ought not to do with the model.*
-->

<!--
## Bias, Risks and Limitations

*What are the known or foreseeable issues stemming from this model? You could also flag here known failure cases or weaknesses of the model.*
-->

<!--
### Recommendations

*What are recommendations with respect to the foreseeable issues? For example, filtering explicit content.*
-->

## Training Details

### Training Dataset

#### Unnamed Dataset

* Size: 942,023 training samples
* Columns: <code>sentence_0</code>, <code>sentence_1</code>, and <code>label</code>
* Approximate statistics based on the first 1000 samples:
  |         | sentence_0                                                                         | sentence_1                                                                        | label                                                         |
  |:--------|:-----------------------------------------------------------------------------------|:----------------------------------------------------------------------------------|:--------------------------------------------------------------|
  | type    | string                                                                             | string                                                                            | float                                                         |
  | details | <ul><li>min: 4 tokens</li><li>mean: 20.76 tokens</li><li>max: 112 tokens</li></ul> | <ul><li>min: 4 tokens</li><li>mean: 12.17 tokens</li><li>max: 39 tokens</li></ul> | <ul><li>min: 0.0</li><li>mean: 0.5</li><li>max: 1.0</li></ul> |
* Samples:
  | sentence_0                                                                                                                                                                                    | sentence_1                                                                   | label            |
  |:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------|:-----------------|
  | <code>He located one man who seemed a little brighter than the others.</code>                                                                                                                 | <code>He picked up one man who was wearing spectacles.</code>                | <code>0.5</code> |
  | <code>A black man with green shorts and a black shirt sitting on a concrete slab.</code>                                                                                                      | <code>A black man wearing a clownsuit is getting ready for the party.</code> | <code>0.0</code> |
  | <code>One girl rides a horse while a woman appears to lead them across a park while two other horses walk in the near background, with a street and parked cars in the far background.</code> | <code>A mother and daughter go horse back riding in an urban park.</code>    | <code>0.5</code> |
* Loss: [<code>CosineSimilarityLoss</code>](https://sbert.net/docs/package_reference/sentence_transformer/losses.html#cosinesimilarityloss) with these parameters:
  ```json
  {
      "loss_fct": "torch.nn.modules.loss.MSELoss"
  }
  ```

### Training Hyperparameters
#### Non-Default Hyperparameters

- `per_device_train_batch_size`: 16
- `per_device_eval_batch_size`: 16
- `num_train_epochs`: 4
- `multi_dataset_batch_sampler`: round_robin

#### All Hyperparameters
<details><summary>Click to expand</summary>

- `do_predict`: False
- `eval_strategy`: no
- `prediction_loss_only`: True
- `per_device_train_batch_size`: 16
- `per_device_eval_batch_size`: 16
- `gradient_accumulation_steps`: 1
- `eval_accumulation_steps`: None
- `torch_empty_cache_steps`: None
- `learning_rate`: 5e-05
- `weight_decay`: 0.0
- `adam_beta1`: 0.9
- `adam_beta2`: 0.999
- `adam_epsilon`: 1e-08
- `max_grad_norm`: 1
- `num_train_epochs`: 4
- `max_steps`: -1
- `lr_scheduler_type`: linear
- `lr_scheduler_kwargs`: None
- `warmup_ratio`: None
- `warmup_steps`: 0
- `log_level`: passive
- `log_level_replica`: warning
- `log_on_each_node`: True
- `logging_nan_inf_filter`: True
- `enable_jit_checkpoint`: False
- `save_on_each_node`: False
- `save_only_model`: False
- `restore_callback_states_from_checkpoint`: False
- `use_cpu`: False
- `seed`: 42
- `data_seed`: None
- `bf16`: False
- `fp16`: False
- `bf16_full_eval`: False
- `fp16_full_eval`: False
- `tf32`: None
- `local_rank`: -1
- `ddp_backend`: None
- `debug`: []
- `dataloader_drop_last`: False
- `dataloader_num_workers`: 0
- `dataloader_prefetch_factor`: None
- `disable_tqdm`: False
- `remove_unused_columns`: True
- `label_names`: None
- `load_best_model_at_end`: False
- `ignore_data_skip`: False
- `fsdp`: []
- `fsdp_config`: {'min_num_params': 0, 'xla': False, 'xla_fsdp_v2': False, 'xla_fsdp_grad_ckpt': False}
- `accelerator_config`: {'split_batches': False, 'dispatch_batches': None, 'even_batches': True, 'use_seedable_sampler': True, 'non_blocking': False, 'gradient_accumulation_kwargs': None}
- `parallelism_config`: None
- `deepspeed`: None
- `label_smoothing_factor`: 0.0
- `optim`: adamw_torch_fused
- `optim_args`: None
- `group_by_length`: False
- `length_column_name`: length
- `project`: huggingface
- `trackio_space_id`: trackio
- `ddp_find_unused_parameters`: None
- `ddp_bucket_cap_mb`: None
- `ddp_broadcast_buffers`: False
- `dataloader_pin_memory`: True
- `dataloader_persistent_workers`: False
- `skip_memory_metrics`: True
- `push_to_hub`: False
- `resume_from_checkpoint`: None
- `hub_model_id`: None
- `hub_strategy`: every_save
- `hub_private_repo`: None
- `hub_always_push`: False
- `hub_revision`: None
- `gradient_checkpointing`: False
- `gradient_checkpointing_kwargs`: None
- `include_for_metrics`: []
- `eval_do_concat_batches`: True
- `auto_find_batch_size`: False
- `full_determinism`: False
- `ddp_timeout`: 1800
- `torch_compile`: False
- `torch_compile_backend`: None
- `torch_compile_mode`: None
- `include_num_input_tokens_seen`: no
- `neftune_noise_alpha`: None
- `optim_target_modules`: None
- `batch_eval_metrics`: False
- `eval_on_start`: False
- `use_liger_kernel`: False
- `liger_kernel_config`: None
- `eval_use_gather_object`: False
- `average_tokens_across_devices`: True
- `use_cache`: False
- `prompts`: None
- `batch_sampler`: batch_sampler
- `multi_dataset_batch_sampler`: round_robin
- `router_mapping`: {}
- `learning_rate_mapping`: {}

</details>

### Training Logs
<details><summary>Click to expand</summary>

| Epoch  | Step   | Training Loss |
|:------:|:------:|:-------------:|
| 0.0085 | 500    | 0.1102        |
| 0.0170 | 1000   | 0.1022        |
| 0.0255 | 1500   | 0.1003        |
| 0.0340 | 2000   | 0.1019        |
| 0.0425 | 2500   | 0.0975        |
| 0.0510 | 3000   | 0.0969        |
| 0.0594 | 3500   | 0.0944        |
| 0.0679 | 4000   | 0.0990        |
| 0.0764 | 4500   | 0.0912        |
| 0.0849 | 5000   | 0.0943        |
| 0.0934 | 5500   | 0.0936        |
| 0.1019 | 6000   | 0.0932        |
| 0.1104 | 6500   | 0.0916        |
| 0.1189 | 7000   | 0.0929        |
| 0.1274 | 7500   | 0.0923        |
| 0.1359 | 8000   | 0.0915        |
| 0.1444 | 8500   | 0.0907        |
| 0.1529 | 9000   | 0.0896        |
| 0.1614 | 9500   | 0.0880        |
| 0.1698 | 10000  | 0.0898        |
| 0.1783 | 10500  | 0.0886        |
| 0.1868 | 11000  | 0.0907        |
| 0.1953 | 11500  | 0.0901        |
| 0.2038 | 12000  | 0.0921        |
| 0.2123 | 12500  | 0.0880        |
| 0.2208 | 13000  | 0.0912        |
| 0.2293 | 13500  | 0.0881        |
| 0.2378 | 14000  | 0.0894        |
| 0.2463 | 14500  | 0.0901        |
| 0.2548 | 15000  | 0.0870        |
| 0.2633 | 15500  | 0.0878        |
| 0.2718 | 16000  | 0.0889        |
| 0.2802 | 16500  | 0.0892        |
| 0.2887 | 17000  | 0.0856        |
| 0.2972 | 17500  | 0.0872        |
| 0.3057 | 18000  | 0.0883        |
| 0.3142 | 18500  | 0.0894        |
| 0.3227 | 19000  | 0.0892        |
| 0.3312 | 19500  | 0.0870        |
| 0.3397 | 20000  | 0.0873        |
| 0.3482 | 20500  | 0.0889        |
| 0.3567 | 21000  | 0.0859        |
| 0.3652 | 21500  | 0.0892        |
| 0.3737 | 22000  | 0.0870        |
| 0.3822 | 22500  | 0.0862        |
| 0.3906 | 23000  | 0.0887        |
| 0.3991 | 23500  | 0.0865        |
| 0.4076 | 24000  | 0.0861        |
| 0.4161 | 24500  | 0.0838        |
| 0.4246 | 25000  | 0.0869        |
| 0.4331 | 25500  | 0.0864        |
| 0.4416 | 26000  | 0.0870        |
| 0.4501 | 26500  | 0.0870        |
| 0.4586 | 27000  | 0.0871        |
| 0.4671 | 27500  | 0.0866        |
| 0.4756 | 28000  | 0.0874        |
| 0.4841 | 28500  | 0.0845        |
| 0.4926 | 29000  | 0.0850        |
| 0.5010 | 29500  | 0.0817        |
| 0.5095 | 30000  | 0.0845        |
| 0.5180 | 30500  | 0.0862        |
| 0.5265 | 31000  | 0.0854        |
| 0.5350 | 31500  | 0.0830        |
| 0.5435 | 32000  | 0.0850        |
| 0.5520 | 32500  | 0.0850        |
| 0.5605 | 33000  | 0.0868        |
| 0.5690 | 33500  | 0.0861        |
| 0.5775 | 34000  | 0.0827        |
| 0.5860 | 34500  | 0.0876        |
| 0.5945 | 35000  | 0.0854        |
| 0.6030 | 35500  | 0.0838        |
| 0.6114 | 36000  | 0.0859        |
| 0.6199 | 36500  | 0.0828        |
| 0.6284 | 37000  | 0.0824        |
| 0.6369 | 37500  | 0.0836        |
| 0.6454 | 38000  | 0.0829        |
| 0.6539 | 38500  | 0.0850        |
| 0.6624 | 39000  | 0.0846        |
| 0.6709 | 39500  | 0.0851        |
| 0.6794 | 40000  | 0.0832        |
| 0.6879 | 40500  | 0.0839        |
| 0.6964 | 41000  | 0.0833        |
| 0.7049 | 41500  | 0.0853        |
| 0.7134 | 42000  | 0.0816        |
| 0.7218 | 42500  | 0.0841        |
| 0.7303 | 43000  | 0.0864        |
| 0.7388 | 43500  | 0.0842        |
| 0.7473 | 44000  | 0.0851        |
| 0.7558 | 44500  | 0.0846        |
| 0.7643 | 45000  | 0.0829        |
| 0.7728 | 45500  | 0.0821        |
| 0.7813 | 46000  | 0.0862        |
| 0.7898 | 46500  | 0.0839        |
| 0.7983 | 47000  | 0.0856        |
| 0.8068 | 47500  | 0.0818        |
| 0.8153 | 48000  | 0.0838        |
| 0.8238 | 48500  | 0.0836        |
| 0.8322 | 49000  | 0.0822        |
| 0.8407 | 49500  | 0.0841        |
| 0.8492 | 50000  | 0.0837        |
| 0.8577 | 50500  | 0.0819        |
| 0.8662 | 51000  | 0.0826        |
| 0.8747 | 51500  | 0.0813        |
| 0.8832 | 52000  | 0.0816        |
| 0.8917 | 52500  | 0.0824        |
| 0.9002 | 53000  | 0.0823        |
| 0.9087 | 53500  | 0.0814        |
| 0.9172 | 54000  | 0.0835        |
| 0.9257 | 54500  | 0.0814        |
| 0.9342 | 55000  | 0.0811        |
| 0.9426 | 55500  | 0.0796        |
| 0.9511 | 56000  | 0.0824        |
| 0.9596 | 56500  | 0.0816        |
| 0.9681 | 57000  | 0.0802        |
| 0.9766 | 57500  | 0.0812        |
| 0.9851 | 58000  | 0.0813        |
| 0.9936 | 58500  | 0.0803        |
| 1.0021 | 59000  | 0.0830        |
| 1.0106 | 59500  | 0.0765        |
| 1.0191 | 60000  | 0.0769        |
| 1.0276 | 60500  | 0.0751        |
| 1.0361 | 61000  | 0.0756        |
| 1.0446 | 61500  | 0.0758        |
| 1.0530 | 62000  | 0.0757        |
| 1.0615 | 62500  | 0.0751        |
| 1.0700 | 63000  | 0.0750        |
| 1.0785 | 63500  | 0.0770        |
| 1.0870 | 64000  | 0.0751        |
| 1.0955 | 64500  | 0.0741        |
| 1.1040 | 65000  | 0.0759        |
| 1.1125 | 65500  | 0.0754        |
| 1.1210 | 66000  | 0.0741        |
| 1.1295 | 66500  | 0.0757        |
| 1.1380 | 67000  | 0.0774        |
| 1.1465 | 67500  | 0.0778        |
| 1.1550 | 68000  | 0.0759        |
| 1.1634 | 68500  | 0.0767        |
| 1.1719 | 69000  | 0.0755        |
| 1.1804 | 69500  | 0.0744        |
| 1.1889 | 70000  | 0.0733        |
| 1.1974 | 70500  | 0.0753        |
| 1.2059 | 71000  | 0.0727        |
| 1.2144 | 71500  | 0.0767        |
| 1.2229 | 72000  | 0.0744        |
| 1.2314 | 72500  | 0.0753        |
| 1.2399 | 73000  | 0.0753        |
| 1.2484 | 73500  | 0.0738        |
| 1.2569 | 74000  | 0.0757        |
| 1.2653 | 74500  | 0.0751        |
| 1.2738 | 75000  | 0.0742        |
| 1.2823 | 75500  | 0.0751        |
| 1.2908 | 76000  | 0.0748        |
| 1.2993 | 76500  | 0.0763        |
| 1.3078 | 77000  | 0.0747        |
| 1.3163 | 77500  | 0.0748        |
| 1.3248 | 78000  | 0.0740        |
| 1.3333 | 78500  | 0.0753        |
| 1.3418 | 79000  | 0.0762        |
| 1.3503 | 79500  | 0.0756        |
| 1.3588 | 80000  | 0.0748        |
| 1.3673 | 80500  | 0.0742        |
| 1.3757 | 81000  | 0.0758        |
| 1.3842 | 81500  | 0.0734        |
| 1.3927 | 82000  | 0.0749        |
| 1.4012 | 82500  | 0.0757        |
| 1.4097 | 83000  | 0.0737        |
| 1.4182 | 83500  | 0.0756        |
| 1.4267 | 84000  | 0.0763        |
| 1.4352 | 84500  | 0.0754        |
| 1.4437 | 85000  | 0.0743        |
| 1.4522 | 85500  | 0.0757        |
| 1.4607 | 86000  | 0.0753        |
| 1.4692 | 86500  | 0.0742        |
| 1.4777 | 87000  | 0.0745        |
| 1.4861 | 87500  | 0.0764        |
| 1.4946 | 88000  | 0.0766        |
| 1.5031 | 88500  | 0.0749        |
| 1.5116 | 89000  | 0.0731        |
| 1.5201 | 89500  | 0.0736        |
| 1.5286 | 90000  | 0.0743        |
| 1.5371 | 90500  | 0.0735        |
| 1.5456 | 91000  | 0.0770        |
| 1.5541 | 91500  | 0.0729        |
| 1.5626 | 92000  | 0.0754        |
| 1.5711 | 92500  | 0.0741        |
| 1.5796 | 93000  | 0.0744        |
| 1.5881 | 93500  | 0.0748        |
| 1.5965 | 94000  | 0.0766        |
| 1.6050 | 94500  | 0.0753        |
| 1.6135 | 95000  | 0.0747        |
| 1.6220 | 95500  | 0.0720        |
| 1.6305 | 96000  | 0.0727        |
| 1.6390 | 96500  | 0.0761        |
| 1.6475 | 97000  | 0.0753        |
| 1.6560 | 97500  | 0.0757        |
| 1.6645 | 98000  | 0.0731        |
| 1.6730 | 98500  | 0.0733        |
| 1.6815 | 99000  | 0.0766        |
| 1.6900 | 99500  | 0.0740        |
| 1.6985 | 100000 | 0.0726        |
| 1.7069 | 100500 | 0.0732        |
| 1.7154 | 101000 | 0.0757        |
| 1.7239 | 101500 | 0.0713        |
| 1.7324 | 102000 | 0.0751        |
| 1.7409 | 102500 | 0.0740        |
| 1.7494 | 103000 | 0.0756        |
| 1.7579 | 103500 | 0.0729        |
| 1.7664 | 104000 | 0.0734        |
| 1.7749 | 104500 | 0.0736        |
| 1.7834 | 105000 | 0.0751        |
| 1.7919 | 105500 | 0.0715        |
| 1.8004 | 106000 | 0.0733        |
| 1.8089 | 106500 | 0.0739        |
| 1.8173 | 107000 | 0.0706        |
| 1.8258 | 107500 | 0.0718        |
| 1.8343 | 108000 | 0.0733        |
| 1.8428 | 108500 | 0.0753        |
| 1.8513 | 109000 | 0.0740        |
| 1.8598 | 109500 | 0.0725        |
| 1.8683 | 110000 | 0.0745        |
| 1.8768 | 110500 | 0.0758        |
| 1.8853 | 111000 | 0.0743        |
| 1.8938 | 111500 | 0.0740        |
| 1.9023 | 112000 | 0.0750        |
| 1.9108 | 112500 | 0.0734        |
| 1.9193 | 113000 | 0.0747        |
| 1.9277 | 113500 | 0.0731        |
| 1.9362 | 114000 | 0.0732        |
| 1.9447 | 114500 | 0.0758        |
| 1.9532 | 115000 | 0.0750        |
| 1.9617 | 115500 | 0.0733        |
| 1.9702 | 116000 | 0.0753        |
| 1.9787 | 116500 | 0.0743        |
| 1.9872 | 117000 | 0.0749        |
| 1.9957 | 117500 | 0.0734        |
| 2.0042 | 118000 | 0.0709        |
| 2.0127 | 118500 | 0.0667        |
| 2.0212 | 119000 | 0.0685        |
| 2.0297 | 119500 | 0.0681        |
| 2.0381 | 120000 | 0.0689        |
| 2.0466 | 120500 | 0.0668        |
| 2.0551 | 121000 | 0.0689        |
| 2.0636 | 121500 | 0.0699        |
| 2.0721 | 122000 | 0.0696        |
| 2.0806 | 122500 | 0.0686        |
| 2.0891 | 123000 | 0.0692        |
| 2.0976 | 123500 | 0.0686        |
| 2.1061 | 124000 | 0.0675        |
| 2.1146 | 124500 | 0.0664        |
| 2.1231 | 125000 | 0.0675        |
| 2.1316 | 125500 | 0.0688        |
| 2.1401 | 126000 | 0.0672        |
| 2.1485 | 126500 | 0.0666        |
| 2.1570 | 127000 | 0.0695        |
| 2.1655 | 127500 | 0.0692        |
| 2.1740 | 128000 | 0.0679        |
| 2.1825 | 128500 | 0.0694        |
| 2.1910 | 129000 | 0.0675        |
| 2.1995 | 129500 | 0.0675        |
| 2.2080 | 130000 | 0.0672        |
| 2.2165 | 130500 | 0.0679        |
| 2.2250 | 131000 | 0.0690        |
| 2.2335 | 131500 | 0.0674        |
| 2.2420 | 132000 | 0.0696        |
| 2.2505 | 132500 | 0.0678        |
| 2.2589 | 133000 | 0.0702        |
| 2.2674 | 133500 | 0.0678        |
| 2.2759 | 134000 | 0.0684        |
| 2.2844 | 134500 | 0.0695        |
| 2.2929 | 135000 | 0.0688        |
| 2.3014 | 135500 | 0.0698        |
| 2.3099 | 136000 | 0.0662        |
| 2.3184 | 136500 | 0.0693        |
| 2.3269 | 137000 | 0.0687        |
| 2.3354 | 137500 | 0.0683        |
| 2.3439 | 138000 | 0.0670        |
| 2.3524 | 138500 | 0.0669        |
| 2.3609 | 139000 | 0.0671        |
| 2.3693 | 139500 | 0.0666        |
| 2.3778 | 140000 | 0.0678        |
| 2.3863 | 140500 | 0.0676        |
| 2.3948 | 141000 | 0.0677        |
| 2.4033 | 141500 | 0.0689        |
| 2.4118 | 142000 | 0.0673        |
| 2.4203 | 142500 | 0.0709        |
| 2.4288 | 143000 | 0.0672        |
| 2.4373 | 143500 | 0.0688        |
| 2.4458 | 144000 | 0.0690        |
| 2.4543 | 144500 | 0.0676        |
| 2.4628 | 145000 | 0.0702        |
| 2.4713 | 145500 | 0.0659        |
| 2.4797 | 146000 | 0.0680        |
| 2.4882 | 146500 | 0.0666        |
| 2.4967 | 147000 | 0.0687        |
| 2.5052 | 147500 | 0.0681        |
| 2.5137 | 148000 | 0.0673        |
| 2.5222 | 148500 | 0.0695        |
| 2.5307 | 149000 | 0.0674        |
| 2.5392 | 149500 | 0.0669        |
| 2.5477 | 150000 | 0.0679        |
| 2.5562 | 150500 | 0.0670        |
| 2.5647 | 151000 | 0.0672        |
| 2.5732 | 151500 | 0.0683        |
| 2.5817 | 152000 | 0.0691        |
| 2.5901 | 152500 | 0.0678        |
| 2.5986 | 153000 | 0.0699        |
| 2.6071 | 153500 | 0.0670        |
| 2.6156 | 154000 | 0.0696        |
| 2.6241 | 154500 | 0.0674        |
| 2.6326 | 155000 | 0.0700        |
| 2.6411 | 155500 | 0.0689        |
| 2.6496 | 156000 | 0.0678        |
| 2.6581 | 156500 | 0.0683        |
| 2.6666 | 157000 | 0.0685        |
| 2.6751 | 157500 | 0.0676        |
| 2.6836 | 158000 | 0.0671        |
| 2.6921 | 158500 | 0.0694        |
| 2.7005 | 159000 | 0.0686        |
| 2.7090 | 159500 | 0.0679        |
| 2.7175 | 160000 | 0.0690        |
| 2.7260 | 160500 | 0.0677        |
| 2.7345 | 161000 | 0.0696        |
| 2.7430 | 161500 | 0.0675        |
| 2.7515 | 162000 | 0.0684        |
| 2.7600 | 162500 | 0.0685        |
| 2.7685 | 163000 | 0.0686        |
| 2.7770 | 163500 | 0.0686        |
| 2.7855 | 164000 | 0.0683        |
| 2.7940 | 164500 | 0.0678        |
| 2.8025 | 165000 | 0.0683        |
| 2.8109 | 165500 | 0.0692        |
| 2.8194 | 166000 | 0.0679        |
| 2.8279 | 166500 | 0.0693        |
| 2.8364 | 167000 | 0.0697        |
| 2.8449 | 167500 | 0.0690        |
| 2.8534 | 168000 | 0.0686        |
| 2.8619 | 168500 | 0.0666        |
| 2.8704 | 169000 | 0.0664        |
| 2.8789 | 169500 | 0.0680        |
| 2.8874 | 170000 | 0.0679        |
| 2.8959 | 170500 | 0.0679        |
| 2.9044 | 171000 | 0.0663        |
| 2.9129 | 171500 | 0.0689        |
| 2.9213 | 172000 | 0.0682        |
| 2.9298 | 172500 | 0.0689        |
| 2.9383 | 173000 | 0.0671        |
| 2.9468 | 173500 | 0.0673        |
| 2.9553 | 174000 | 0.0676        |
| 2.9638 | 174500 | 0.0677        |
| 2.9723 | 175000 | 0.0677        |
| 2.9808 | 175500 | 0.0686        |
| 2.9893 | 176000 | 0.0681        |
| 2.9978 | 176500 | 0.0685        |
| 3.0063 | 177000 | 0.0637        |
| 3.0148 | 177500 | 0.0643        |
| 3.0233 | 178000 | 0.0626        |
| 3.0317 | 178500 | 0.0620        |
| 3.0402 | 179000 | 0.0623        |
| 3.0487 | 179500 | 0.0624        |
| 3.0572 | 180000 | 0.0633        |
| 3.0657 | 180500 | 0.0631        |
| 3.0742 | 181000 | 0.0650        |
| 3.0827 | 181500 | 0.0631        |
| 3.0912 | 182000 | 0.0638        |
| 3.0997 | 182500 | 0.0645        |
| 3.1082 | 183000 | 0.0629        |
| 3.1167 | 183500 | 0.0626        |
| 3.1252 | 184000 | 0.0651        |
| 3.1337 | 184500 | 0.0620        |
| 3.1421 | 185000 | 0.0638        |
| 3.1506 | 185500 | 0.0643        |
| 3.1591 | 186000 | 0.0629        |
| 3.1676 | 186500 | 0.0630        |
| 3.1761 | 187000 | 0.0635        |
| 3.1846 | 187500 | 0.0643        |
| 3.1931 | 188000 | 0.0620        |
| 3.2016 | 188500 | 0.0637        |
| 3.2101 | 189000 | 0.0658        |
| 3.2186 | 189500 | 0.0640        |
| 3.2271 | 190000 | 0.0637        |
| 3.2356 | 190500 | 0.0648        |
| 3.2441 | 191000 | 0.0642        |
| 3.2525 | 191500 | 0.0630        |
| 3.2610 | 192000 | 0.0641        |
| 3.2695 | 192500 | 0.0633        |
| 3.2780 | 193000 | 0.0631        |
| 3.2865 | 193500 | 0.0645        |
| 3.2950 | 194000 | 0.0639        |
| 3.3035 | 194500 | 0.0641        |
| 3.3120 | 195000 | 0.0651        |
| 3.3205 | 195500 | 0.0660        |
| 3.3290 | 196000 | 0.0633        |
| 3.3375 | 196500 | 0.0645        |
| 3.3460 | 197000 | 0.0623        |
| 3.3545 | 197500 | 0.0628        |
| 3.3629 | 198000 | 0.0640        |
| 3.3714 | 198500 | 0.0641        |
| 3.3799 | 199000 | 0.0662        |
| 3.3884 | 199500 | 0.0628        |
| 3.3969 | 200000 | 0.0654        |
| 3.4054 | 200500 | 0.0616        |
| 3.4139 | 201000 | 0.0640        |
| 3.4224 | 201500 | 0.0653        |
| 3.4309 | 202000 | 0.0638        |
| 3.4394 | 202500 | 0.0632        |
| 3.4479 | 203000 | 0.0642        |
| 3.4564 | 203500 | 0.0640        |
| 3.4649 | 204000 | 0.0624        |
| 3.4733 | 204500 | 0.0632        |
| 3.4818 | 205000 | 0.0639        |
| 3.4903 | 205500 | 0.0649        |
| 3.4988 | 206000 | 0.0641        |
| 3.5073 | 206500 | 0.0631        |
| 3.5158 | 207000 | 0.0633        |
| 3.5243 | 207500 | 0.0643        |
| 3.5328 | 208000 | 0.0649        |
| 3.5413 | 208500 | 0.0633        |
| 3.5498 | 209000 | 0.0635        |
| 3.5583 | 209500 | 0.0640        |
| 3.5668 | 210000 | 0.0641        |
| 3.5753 | 210500 | 0.0652        |
| 3.5837 | 211000 | 0.0650        |
| 3.5922 | 211500 | 0.0645        |
| 3.6007 | 212000 | 0.0616        |
| 3.6092 | 212500 | 0.0640        |
| 3.6177 | 213000 | 0.0633        |
| 3.6262 | 213500 | 0.0615        |
| 3.6347 | 214000 | 0.0615        |
| 3.6432 | 214500 | 0.0620        |
| 3.6517 | 215000 | 0.0646        |
| 3.6602 | 215500 | 0.0647        |
| 3.6687 | 216000 | 0.0641        |
| 3.6772 | 216500 | 0.0643        |
| 3.6856 | 217000 | 0.0648        |
| 3.6941 | 217500 | 0.0636        |
| 3.7026 | 218000 | 0.0655        |
| 3.7111 | 218500 | 0.0645        |
| 3.7196 | 219000 | 0.0629        |
| 3.7281 | 219500 | 0.0630        |
| 3.7366 | 220000 | 0.0633        |
| 3.7451 | 220500 | 0.0637        |
| 3.7536 | 221000 | 0.0641        |
| 3.7621 | 221500 | 0.0627        |
| 3.7706 | 222000 | 0.0640        |
| 3.7791 | 222500 | 0.0612        |
| 3.7876 | 223000 | 0.0644        |
| 3.7960 | 223500 | 0.0637        |
| 3.8045 | 224000 | 0.0648        |
| 3.8130 | 224500 | 0.0636        |
| 3.8215 | 225000 | 0.0624        |
| 3.8300 | 225500 | 0.0623        |
| 3.8385 | 226000 | 0.0648        |
| 3.8470 | 226500 | 0.0657        |
| 3.8555 | 227000 | 0.0634        |
| 3.8640 | 227500 | 0.0632        |
| 3.8725 | 228000 | 0.0639        |
| 3.8810 | 228500 | 0.0649        |
| 3.8895 | 229000 | 0.0634        |
| 3.8980 | 229500 | 0.0626        |
| 3.9064 | 230000 | 0.0630        |
| 3.9149 | 230500 | 0.0645        |
| 3.9234 | 231000 | 0.0636        |
| 3.9319 | 231500 | 0.0636        |
| 3.9404 | 232000 | 0.0624        |
| 3.9489 | 232500 | 0.0613        |
| 3.9574 | 233000 | 0.0643        |
| 3.9659 | 233500 | 0.0638        |
| 3.9744 | 234000 | 0.0623        |
| 3.9829 | 234500 | 0.0630        |
| 3.9914 | 235000 | 0.0643        |
| 3.9999 | 235500 | 0.0626        |

</details>

### Framework Versions
- Python: 3.12.12
- Sentence Transformers: 5.2.3
- Transformers: 5.0.0
- PyTorch: 2.10.0+cu128
- Accelerate: 1.12.0
- Datasets: 4.0.0
- Tokenizers: 0.22.2

## Citation

### BibTeX

#### Sentence Transformers
```bibtex
@inproceedings{reimers-2019-sentence-bert,
    title = "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks",
    author = "Reimers, Nils and Gurevych, Iryna",
    booktitle = "Proceedings of the 2019 Conference on Empirical Methods in Natural Language Processing",
    month = "11",
    year = "2019",
    publisher = "Association for Computational Linguistics",
    url = "https://arxiv.org/abs/1908.10084",
}
```

<!--
## Glossary

*Clearly define terms in order to be accessible across audiences.*
-->

<!--
## Model Card Authors

*Lists the people who create the model card, providing recognition and accountability for the detailed work that goes into its construction.*
-->

<!--
## Model Card Contact

*Provides a way for people who have updates to the Model Card, suggestions, or questions, to contact the Model Card authors.*
-->