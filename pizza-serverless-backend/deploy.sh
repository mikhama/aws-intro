#!/bin/bash
source ./.env
serverless deploy --stage $STAGE --adminEmail $ADMIN_EMAIL
