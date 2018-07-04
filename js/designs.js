$(document).ready(function() {
  // jquery selectors
  const $mainTitle = $(".main-title");
  // interface
  const $interface = $(".interface-container");
  const $input = $(".interface-input");
  const $heightInput = $(".interface-input-height");
  const $widthInput = $(".interface-input-width");
  const $heightAddBtn = $(".interface-add-btn-height");
  const $heightSubBtn = $(".interface-sub-btn-height");
  const $widthAddBtn = $(".interface-add-btn-width");
  const $widthSubBtn = $(".interface-sub-btn-width");
  const $createBtn = $(".interface-create-btn");
  const $heightTooltip = $(".interface-tooltip-height");
  const $widthTooltip = $(".interface-tooltip-width");
  const $presetSmall = $("#preset-small");
  const $presetMedium = $("#preset-medium");
  const $presetLarge = $("#preset-large");
  const $presetFull = $("#preset-full");
  const $smallDescription = $("#small-description");
  const $mediumDescription = $("#medium-description");
  const $largeDescription = $("#large-description");
  const $fullDescription = $("#full-description");
  // modal
  const $modal = $(".modal");
  const $pixelCanvasContainer = $(".modal-pixel-canvas-container");
  const $pixelCanvas = $(".modal-pixel-canvas");
  const $closeBtn = $(".modal-close-btn");
  const $colorInput = $(".modal-color-input");
  const $paintBtn = $(".modal-paint-btn");
  const $eraseBtn = $(".modal-erase-btn");
  const $dropperBtn = $(".modal-dropper-btn");
  const $clearBtn = $(".modal-clear-btn");
  const $paintTooltip = $(".modal-paint-tooltip");
  const $colorBtn = $(".modal-color-btn");
  const $popup = $(".modal-popup");
  const $popupText = $(".modal-popup-text");
  const $popupYesBtn = $(".modal-popup-yes-btn");
  const $popupNoBtn = $(".modal-popup-no-btn");
  const $iconActive = $(".modal-icon-active");
  const $modalNav = $(".modal-nav");
  const $modalToolbar = $(".modal-toolbar");

  // grid sizes
  let smallHeight;
  let smallWidth;
  let mediumHeight;
  let mediumWidth;
  let largeHeight;
  let largeWidth;
  let maxHeight;
  let maxWidth;

  // string concat cache 16ms
  function makeGrid(height, width) {
    let tableRows = ""; // store string concatenations aka "cache"
    let row = 1;
    while (row <= height) {
      tableRows += "<tr>";
      for (let col = 1; col <= width; col++) {
        tableRows += "<td></td>";
      }
      tableRows += "</tr>";
      row += 1;
    }
    $pixelCanvas.append(tableRows); // add grid to dom
    $modal.css("visibility", "visible");
  }

  // cache version 34ms
  // function makeGrid(height,width) {
  // 	let $tbody = $("<tbody></tbody>"); // the "cache"
  // 	let $tr, $td;
  // 	for(let row = 0; row < height; row++) {
  // 		$tr = $("<tr></tr>");
  // 		for(let col =0; col < width; col++) {
  // 			$td = $("<td></td>");
  // 			$tr.append($td);
  // 		}
  // 		$tbody.append($tr);
  // 	}
  // 	$pixelCanvas.append($tbody); // add grid to dom
  // }

  // // non-cache version 52ms
  // function makeGrid(height,width) {
  // 	let $tr, $td;
  // 	for(let row = 0; row < height; row++) {
  // 		$tr = $("<tr></tr>");
  // 		$pixelCanvas.append($tr);
  // 		for(let col =0; col < width; col++) {
  // 			$td = $("<td></td>");
  // 			$tr.append($td);
  // 		}
  // 	}
  // }

  // preset grids
  $presetSmall.on("click", function() {
    // small
    $(".preset-container").removeClass("active");
    $(this).addClass("active");
    assignSize(smallHeight, smallWidth);
  });
  $presetMedium.on("click", function() {
    // medium
    $(".preset-container").removeClass("active");
    $(this).addClass("active");
    assignSize(mediumHeight, mediumWidth);
  });
  $presetLarge.on("click", function() {
    // large
    $(".preset-container").removeClass("active");
    $(this).addClass("active");
    assignSize(largeHeight, largeWidth);
  });
  $presetFull.on("click", function() {
    // full-screen
    $(".preset-container").removeClass("active");
    $(this).addClass("active");
    assignSize(maxHeight, maxWidth);
  });

  // get preset sizes
  function getSize() {
    const tdSize = 20;
    maxHeight = parseInt(($pixelCanvasContainer.height() / tdSize).toFixed());
    maxWidth = parseInt(($pixelCanvasContainer.width() / tdSize).toFixed());
    smallHeight = (maxHeight * 0.4).toFixed();
    smallWidth = (maxWidth * 0.3).toFixed();
    mediumHeight = (maxHeight * 0.6).toFixed();
    mediumWidth = (maxWidth * 0.4).toFixed();
    largeHeight = (maxHeight * 0.8).toFixed();
    largeWidth = (maxWidth * 0.6).toFixed();
  }

  // assign height/width inputs
  function assignSize(height, width) {
    $heightInput.val(height).attr("max", maxHeight);
    $widthInput.val(width).attr("max", maxWidth);
  }

  // update preset dimension text
  function displaySize() {
    $fullDescription.text(maxHeight + "x" + maxWidth);
    $largeDescription.text(largeHeight + "x" + largeWidth);
    $mediumDescription.text(mediumHeight + "x" + mediumWidth);
    $smallDescription.text(smallHeight + "x" + smallWidth);
  }

  // reassign height/width inputs when browser resizes
  $(window).resize(function() {
    getSize();
    displaySize();
  });
  getSize();
  displaySize();

  let gridHeight;
  let gridWidth;

  // call makeGrid and pass height/width
  $("#submitBtn").on("click keyup", function(e) {
    // $pixelCanvas.css("display","block");
    $modalNav.toggleClass("drop-down");
    $modalToolbar.toggleClass("slide-up");
    $pixelCanvas.toggleClass("slide-right");
    // $(".modal-toolbar").css("display","flex");
    let code = e.keyCode || e.which;
    gridHeight = parseInt($heightInput.val());
    gridWidth = parseInt($widthInput.val());

    // don't submit on tab or space keypress
    if (code === 32 || code === 9) {
      return false;
    } else if (
      gridHeight <= maxHeight &&
      gridHeight > 0 &&
      (gridWidth <= maxWidth && gridWidth > 0)
    ) {
      e.preventDefault();
      makeGrid(gridHeight, gridWidth);

      $interface.css("display", "none");
      $mainTitle.css("display", "none");
    }
  });

  // select all text field
  $input.on("focus", function() {
    this.select();
  });

  // height +/- interface buttons
  $heightAddBtn.click(function() {
    let counter = $heightInput.val();

    if (counter < maxHeight) {
      $heightTooltip.removeClass("interface-tooltip").text("");
      counter++;
      $heightInput.val(counter);
    } else {
      $heightTooltip
        .addClass("interface-tooltip")
        .text("Max height is " + maxHeight);
    }
  });

  $heightSubBtn.click(function() {
    let counter = $heightInput.val();

    if (counter > 1) {
      $heightTooltip.removeClass("interface-tooltip").text("");
      counter--;
      $heightInput.val(counter);
    } else {
      $heightTooltip.addClass("interface-tooltip").text("Min height is 1");
    }
  });

  // width +/- interface buttons
  $widthAddBtn.click(function() {
    // ++
    let counter = $widthInput.val();
    if (counter < maxWidth) {
      $widthTooltip.removeClass("interface-tooltip").text("");
      counter++;
      $widthInput.val(counter);
    } else {
      $widthTooltip
        .addClass("interface-tooltip")
        .text("Max width is " + maxWidth);
    }
  });
  $widthSubBtn.click(function() {
    // --
    let counter = $widthInput.val();
    if (counter > 1) {
      $widthTooltip.removeClass("interface-tooltip").text("");
      counter--;
      $widthInput.val(counter);
    } else {
      $widthTooltip.addClass("interface-tooltip").text("Min width is 1");
    }
  });

  // remove interface tooltip on click
  $(".interface-tooltip-height, .interface-tooltip-width").click(function() {
    $(this)
      .removeClass("interface-tooltip")
      .text("");
  });

  // current selected tool
  let tool = {
    currentTool: ""
  };

  function setTool(newTool) {
    tool["currentTool"] = newTool;
  }
  setTool("draw");

  // left mouse button handler
  $pixelCanvas.on("mousedown mouseover", "td", function(e) {
    e.preventDefault();
    let currentTool = tool["currentTool"];
    let currentColor = color["currentColor"];
    if (e.buttons === 1) {
      if (currentTool == "draw") {
        $(e.target).css("background-color", currentColor);
      } else if (currentTool == "erase") {
        $(e.target).css("background-color", "white");
      } else if (currentTool == "dropper") {
        setColor($(e.target).css("background-color"));
        setColorIcon();
      }
    }
  });

  // holds paint color
  color = {
    currentColor: ""
  };

  function setColor(newColor) {
    color["currentColor"] = newColor;
  }
  setColor($("#custom").val()); // initial color value

  function setColorIcon() {
    let currentColor = color["currentColor"];
    $("#color-icon").css("color", currentColor);
    $colorBtn.css("border-color", "black");
  }

  // set new color
  $("#custom").change(function() {
    setColor($("#custom").val());
    setColorIcon();
  });

  // remove "intro" tooltip
  $(".modal-color-btn").on("click", function() {
    $colorBtn.find("span").removeClass("modal-paint-tooltip");
    $colorBtn.find("span").addClass("modal-tooltip-text");
    $colorBtn.find("span").text("Change Color");
  });

  // set draw to true
  $paintBtn.click(function() {
    setTool("draw");
    $(".modal-icon-active").removeClass("modal-icon-active");
    $paintBtn.addClass("modal-icon-active");
  });

  // set draw to false
  $eraseBtn.click(function() {
    setTool("erase");
    $(".modal-icon-active").removeClass("modal-icon-active");
    $eraseBtn.addClass("modal-icon-active");
  });

  $dropperBtn.click(function() {
    setTool("dropper");
    $(".modal-icon-active").removeClass("modal-icon-active");
    $dropperBtn.addClass("modal-icon-active");
  });

  // condition for popup
  let quit = false;

  // close modal icon
  $closeBtn.click(function() {
    quit = true;
    $popupText.text("All progress will be lost. Are you sure?");
    $popup.addClass("is-visible");
  });

  // clear button popup.
  $clearBtn.click(function() {
    quit = false;
    $popupText.text("Are you sure you want to reset your canvas?");
    $popup.addClass("is-visible");
  });

  // popup yes btn
  $popupYesBtn.click(function() {
    if (quit) {
      $interface.css("display", "flex");
      $mainTitle.css("display", "block");
      $modal.css("visibility", "hidden");
      $modalNav.toggleClass("drop-down");
      $pixelCanvas.toggleClass("slide-right");
      $modalToolbar.toggleClass("slide-up");
      $pixelCanvas.empty();
      $popup.removeClass("is-visible");

      // set draw and color picker back to default color (black)
      currentColor = "#000000";
      $("#color-icon").css("color", currentColor);
    } else {
      $pixelCanvas.find("tr td").css("background-color", "white");
      $popup.removeClass("is-visible");
    }
  });

  // popup no btn
  $popupNoBtn.click(function() {
    $popup.removeClass("is-visible");
  });

  // save grid
  function saveGrid() {
    let output = {
      tableProperties: {
        gridHeight: gridHeight,
        gridWidth: gridWidth
      },
      rows: []
    };

    // retrieve col background colors
    $.each($("#pixel-canvas tr"), function(index, value) {
      let cols = {};
      $.each(this.cells, function(subIndex, subValue) {
        cols[subIndex] = $(subValue).css("backgroundColor");
      });
      output["rows"][index] = cols;
    });

    return JSON.stringify(output, null, "\t"); // return JSON of output
  }

  $(".modal-download-btn").on("click", function() {
    let save = saveGrid();
    console.log(save);
  });
});
