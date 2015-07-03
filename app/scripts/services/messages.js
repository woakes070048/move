'use strict';

/**
 * Translatable strings used directly in JS, for example, in Growls.
 * See: https://angular-gettext.rocketeer.be/dev-guide/annotate-js/
 */
angular.module('lmisChromeApp')
  .service('messages', function(gettextCatalog) {
    this.migrationFailed = gettextCatalog.getString(
      'Data migration failed. Please contact support.'
    );
    this.lgaFacilityListFailed = gettextCatalog.getString(
        'LGA facility list update failed, internet connection is needed to update it'
    );
    this.appConfigSuccessMsg = gettextCatalog.getString(
      'Application configuration saved'
    );
    this.appConfigFailedMsg = gettextCatalog.getString(
      'Application configuration failed, please contact support'
    );
    this.lastUpdated = function(dateUpdated) {
      return gettextCatalog.getString('Last updated: {{date}}', {
        date: dateUpdated
      });
    };
    this.lgaUpdateFailed = gettextCatalog.getString(
      'LGA update failed, internet connection needed to update LGA list.'
    );
    this.specifyBundleType = gettextCatalog.getString(
      'Please specify if its receiving or sending'
    );
    this.incomingDelivery = gettextCatalog.getString(
      'Incoming Delivery'
    );
    this.receivedFrom = gettextCatalog.getString(
      'Received From'
    );
    this.selectSender = gettextCatalog.getString(
      'Select Sending Facility'
    );
    this.selectReceivingLga = gettextCatalog.getString(
      'Select Receiving LGA'
    );
    this.selectSendingWard = gettextCatalog.getString(
      'Select Sending Ward'
    );
    this.outGoingDelivery = gettextCatalog.getString(
      'Outgoing Delivery'
    );
    this.sentTo = gettextCatalog.getString(
      'Sent To'
    );
    this.selectReceiver = gettextCatalog.getString(
      'Select Receiving Facility'
    );
    this.selectSendingLga = gettextCatalog.getString(
      'Select Sending LGA'
    );
    this.selectReceivingWard = gettextCatalog.getString(
      'Select Receiving Ward'
    );
    this.unknownBundleType = gettextCatalog.getString(
      'Unknown bundle type'
    );
    this.selectedFacilityNotFound = gettextCatalog.getString(
      'Selected facility does not exist.'
    );
    this.incomingDeliverySuccessMessage = gettextCatalog.getString(
      'Incoming Delivery logged successfully.'
    );
    this.outgoingDeliverySuccessMessage = gettextCatalog.getString(
      'Outgoing Delivery logged successfully.'
    );
    this.clearStorageFailed = gettextCatalog.getString(
      'Clear storage failed, contact support.'
    );
    this.clearStorageTitle = gettextCatalog.getString(
      'Clear Storage'
    );
    this.clearStorageConfirmationMsg = gettextCatalog.getString(
      'this will erase all data on this phone. You will need to set it up again while online. \nAre you ABSOLUTELY sure?'
    );
    this.yes = gettextCatalog.getString(
      'Yes'
    );
    this.no = gettextCatalog.getString(
      'No'
    );
    this.confirmCcuBreakdownReportHeader = function(ccuID) {
      return gettextCatalog.getString('Confirm {{ccuID}} breakdown report', {
        ccuID: ccuID
      });
    };
    this.dialogConfirmationQuestion = gettextCatalog.getString(
      'are you sure?'
    );
    this.ccuBreakdownReportSuccessMsg = gettextCatalog.getString(
      'CCU breakdown report sent successfully!'
    );
    this.ccuBreakdownReportFailedMsg = gettextCatalog.getString(
      'CCU breakdown report failed, please contact support'
    );
    this.stockCountReminderMsg = gettextCatalog.getString(
      'A stock count is due today!'
    );
    this.stockBelow = gettextCatalog.getString(
      'Buffer stock'
    );
    this.stockAbove = gettextCatalog.getString(
      'Stock'
    );
    this.items = function(count) {
      return gettextCatalog.getPlural(count, 'item', 'items');
    };
    this.stockOutWarningMsg = function(productQuantity, itemName) {
      return gettextCatalog.getString(
        '{{productQuantity}} {{itemName}} low on stock, press to send alert', {
          productQuantity: productQuantity,
          itemName: itemName
        }
      );
    };
    this.settingsSaved = gettextCatalog.getString(
      'Settings saved'
    );
    this.settingsFailed = gettextCatalog.getString(
      'Could not save settings, please contact support'
    );
    this.online = gettextCatalog.getString(
      'Online'
    );
    this.offline = gettextCatalog.getString(
      'Offline'
    );
    this.logIncomingSuccessMessage = gettextCatalog.getString(
      'Incoming success'
    );
    this.syncing = function(source) {
      return gettextCatalog.getString('Syncronising from {{source}}…', {
        source: source
      });
    };
    this.syncSuccess = function(source) {
      return gettextCatalog.getString('Successfully syncronised {{source}}', {
        source: source
      });
    };
    this.local = gettextCatalog.getString(
      'Local'
    );
    this.remote = gettextCatalog.getString(
      'Remote'
    );
    this.showStockCountFailed = gettextCatalog.getString(
      'Could not show Stock Count form, please contact support.'
    );
    this.stockCountSuccessMsg = gettextCatalog.getString(
      'You have completed stock count successfully!'
    );
    this.stockCountSavingFailed = gettextCatalog.getString(
      'Stock count saving failed'
    );
    this.stockOutBroadcastSuccessMsg = gettextCatalog.getString(
      'Stock-out alert sent successfully!'
    );
    this.stockOutBroadcastFailedMsg = gettextCatalog.getString(
      'Stock-out alert failed, please contact support'
    );
    this.confirmStockOutHeader = function(productType) {
      return gettextCatalog.getString(
        'Confirm {{productType}} stock-out broadcast', {
          productType: productType
        }
      );
    };
    this.surveyNotFound = gettextCatalog.getString(
      'Survey not found!'
    );
    this.incompleteSurveyErrorMsg = gettextCatalog.getString(
      'complete survey before saving!'
    );
    this.surveySuccessMsg = function(surveyName) {
      return gettextCatalog.getString(
        '{{surveyName}} was submitted successfully!', {
          surveyName: surveyName
        }
      );
    };
    this.surveyFailedMsg = gettextCatalog.getString(
      'Survey not saved, try again!'
    );
    this.enterQuantity = function(unit) {
      return gettextCatalog.getString('Enter quantity in {{unit}}', {
        unit: unit
      });
    };
    this.wasteCountSaved = gettextCatalog.getString(
      'waste count saved successfully'
    );
    this.remoteAppConfigUpdateMsg = gettextCatalog.getString(
      'Application configurations has been updated.'
    );
    this.belowBuffer = gettextCatalog.getString(
      'Below buffer'
    );
    this.buffer = gettextCatalog.getString(
      'Buffer'
    );
    this.safetyStock = gettextCatalog.getString(
      'Safety Stock'
    );
    this.max = gettextCatalog.getString(
      'Max'
    );
    this.confirmStockOut = gettextCatalog.getString(
      'Confirm stock-out broadcast for the following:'
    );
    this.migrationRequired = gettextCatalog.getString(
      'Applying application update'
    );
    this.stockCountErrorMsg = gettextCatalog.getString(
      'stock count value is invalid, at least enter zero (0) to proceed'
    );
    this.discardErrorMsg = gettextCatalog.getString(
      'Discard stock count'
    );
  });
