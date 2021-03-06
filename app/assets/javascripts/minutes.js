/**
 * Adds a new item after the currently displayed one.
 */
$("#add_new_item").click(function() {
	// activeSection is the id of the active section
	activeSection = getActiveSection()
	
	// then insert the new section before the active section
	var html = newSectionHTML(activeSection)
  $("section.active").before(html)

  // Mark the newly inserted section as active
  var activeBefore = $("section.active")
  var activeAfter = $("section.active").prev()
  activeBefore.removeClass("active")
  activeBefore.css("padding-top", "")
  activeAfter.addClass("active")

  // initialize the redactor field
  activeAfter.find(".redactor-field textarea").redactor({
			lang: 'de',
			buttons: buttons,
			minHeight: 350,
		});

  // renumber the items
  markItemOrdering()

  $("section.active button.add_new_motion").click(function() {
		var html = newMotionHTML(getActiveSection());
		$("section.active div.content").append(html);

		// register the remove function
		$("section.active button.remove_motion").click(function() {
			$(this).parent(".motion").detach();
		})
		})


  // Hack, forces foundation to repaint the section tab bar
  $(window).trigger('resize')
})

/**
 * Shuffles the current item one to the left
 */
$("#move_item_to_left").click(function(){
	// geht nicht weiter nach links!
	if(!$("section.active").prev()) {
		return
	}
	// swap the entries in motionLevels (ugly)
	//var temp = motionLevels[parseInt(getActiveSection() - 1)]
	//motionLevels[parseInt(getActiveSection() - 1)] = motionLevels[getActiveSection()]
	//motionLevels[getActiveSection()] = temp

	var movingNode = $("section.active")
	var replaceNode = movingNode.prev()
	movingNode.insertBefore(replaceNode)

	// renumber the items
  markItemOrdering()
	$(window).trigger('resize')
})

/**
 * Shuffles the current item one to the right
 */
$("#move_item_to_right").click(function(){
	// geht nicht weiter nach rechts!
	if(!$("section.active").next().attr("data-index")) {
		return
	}
	// swap the entries in motionLevels (ugly)
	//var temp = motionLevels[parseInt(getActiveSection()) + 1]
	//motionLevels[parseInt(getActiveSection()) + 1] = motionLevels[getActiveSection()]
	//motionLevels[getActiveSection()] = temp

	var movingNode = $("section.active")
	var replaceNode = movingNode.next()
	movingNode.insertAfter(replaceNode)

	// renumber the items
  markItemOrdering()
	$(window).trigger('resize')
})

/**
 * TODO: Do i need documentataion?
 */
$("button.add_new_motion").click(function() {
	var html = newMotionHTML(getActiveSection());
	$("section.active div.content").append(html);

	// register the remove function
	$("section.active button.remove_motion").click(function() {
		$(this).parent(".motion").detach();
	})
})


getActiveSection = function() {
	return $("section.active").attr("data-index")
}

/**
 * index = index of the new top, e.g. 3 => TOP 3
 */
function newSectionHTML(index) {
	var html = '<section data-index="' + sectionCounter+ '" class="minute-item">' +
					'<p class="title" data-section-title>' +
						'<a href="#"><b><span class="translation_missing" title="translation missing: de.TOP">TOP</span> <span class="item-index">' + index + '</span></b></a>' +
					'</p>' +
					'<div class="content" data-section-content>' +
						'<div class="inline-field">' +
							'<label for="minute_items_attributes_' + sectionCounter + '_title">Titel</label>' +
							'<input id="minute_items_attributes_' + sectionCounter + '_title" name="minute[items_attributes][' + sectionCounter + '][title]" type="text" value="" />' +
						'</div>' +
						'<div class="redactor-field">' +
							'<textarea id="minute_items_attributes_' + sectionCounter + '_content" name="minute[items_attributes][' + sectionCounter + '][content]">' +
							'</textarea>' +
						'</div>' +
						'<button type="button" class="small button add_new_motion" title="Abstimmung hinzufügen">+ Abs</button>' +
						'<input id="minute_items_attributes_' + sectionCounter + '_id" name="minute[items_attributes][' + sectionCounter + '][id]" type="hidden" />' +
						'<input id="minute_items_attributes_' + sectionCounter + '_order" name="minute[items_attributes][' + sectionCounter + '][order]" type="hidden" value="' + index + '" />' +
					'</div>' +
				'</section>';
	// insert that newly discovered index
	motionLevels[sectionCounter] = 0;
	
	sectionCounter++;
	return html;
}

/**
 * This function marks the "Top i" and hidden order field as they appear on the website
 */
function markItemOrdering() {
	var i = 0
	$(".minute-item").each(function() {
  	$(this).find(".title .item-index").html(i);
  	$(this).find("input[id*=minute_items_attributes][id*=order]").attr("value", i)
  	i++
	})
}

/**
 * index = the index of the item to which this is added to
 */
function newMotionHTML(index) {
	var mi = motionLevels[index]
	var html =  '<div class="motion">' +
							'<label for="minute_items_attributes_' + index + '_motions_attributes_' + mi + '_rationale">Rationale</label>' +
							'<textarea id="minute_items_attributes_' + index + '_motions_attributes_' + mi + '_rationale" name="minute[items_attributes][' + index + '][motions_attributes][' + mi + '][rationale]"></textarea>' +
							'<label for="minute_items_attributes_' + index + '_motions_attributes_' + mi + '_mover_id">Antragssteller</label>' +
							'<input id="minute_items_attributes_' + index + '_motions_attributes_' + mi + '_mover_id" name="minute[items_attributes][' + index + '][motions_attributes][' + mi + '][mover_id]" type="text" />' + 
							'<label for="minute_items_attributes_' + index + '_motions_attributes_' + mi + '_pro">Dafür</label>' +
							'<input id="minute_items_attributes_' + index + '_motions_attributes_' + mi + '_pro" name="minute[items_attributes][' + index + '][motions_attributes][' + mi + '][pro]" type="text" />' +
							'<label for="minute_items_attributes_' + index + '_motions_attributes_' + mi + '_abs">Enthaltung</label>' +
							'<input id="minute_items_attributes_' + index + '_motions_attributes_' + mi + '_abs" name="minute[items_attributes][' + index + '][motions_attributes][' + mi + '][abs]" type="text" />' +
							'<label for="minute_items_attributes_' + index + '_motions_attributes_' + mi + '_con">Dagegen</label>' +
							'<input id="minute_items_attributes_' + index + '_motions_attributes_' + mi + '_con" name="minute[items_attributes][' + index + '][motions_attributes][' + mi + '][con]" type="text" />' +
							'<button type="button" class="small button remove_motion" title="Doch nicht">-</button>' +
							'</div><hr/>'
	motionLevels[index] = motionLevels[index] + 1;
	return html
}